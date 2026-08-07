import "server-only";

import { env } from "./env";

/**
 * Payment gateway abstraction.
 *
 * Checkout has exactly two moments the rest of the app cares about: "send the
 * learner somewhere to pay" and "did that actually get paid?". Every provider
 * below implements just those two, so swapping providers is an env change.
 *
 * Enrolment is never granted on the redirect back from a provider — the
 * browser can be told anything. It is granted only after `verify()` confirms
 * the charge server-to-server (see src/app/api/payments/confirm/route.ts).
 */

export type CheckoutRequest = {
  orderId: string;
  amountCents: number;
  currency: string;
  courseTitle: string;
  courseSlug: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  /** Where to send the learner's browser. */
  redirectUrl: string;
  /** Provider-side id we store on the order and verify against later. */
  providerRef: string;
};

export type VerificationResult = {
  paid: boolean;
  amountCents?: number;
  currency?: string;
};

export interface PaymentGateway {
  readonly id: "mock" | "stripe" | "paystack";
  readonly label: string;
  createCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
  verify(providerRef: string): Promise<VerificationResult>;
}

// ---------------------------------------------------------------------------
// Mock — for local development and demos. No network, no keys.
// ---------------------------------------------------------------------------

const mockGateway: PaymentGateway = {
  id: "mock",
  label: "Test gateway",

  async createCheckout(request) {
    const providerRef = `mock_${request.orderId}`;
    // A local page that imitates a hosted card form, so the flow the team
    // demos is the same flow that runs against a real provider.
    const url = new URL("/payments/mock", env.appUrl());
    url.searchParams.set("ref", providerRef);
    url.searchParams.set("amount", String(request.amountCents));
    url.searchParams.set("currency", request.currency);
    url.searchParams.set("course", request.courseTitle);
    url.searchParams.set("success", request.successUrl);
    url.searchParams.set("cancel", request.cancelUrl);
    return { redirectUrl: url.toString(), providerRef };
  },

  async verify(providerRef) {
    // The mock page only redirects to the success URL after the learner
    // "approves" the charge, so reaching verification means it was approved.
    return { paid: providerRef.startsWith("mock_") };
  },
};

// ---------------------------------------------------------------------------
// Stripe Checkout
// ---------------------------------------------------------------------------

function formEncode(data: Record<string, string | number>): string {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
}

const stripeGateway: PaymentGateway = {
  id: "stripe",
  label: "Card (Stripe)",

  async createCheckout(request) {
    const key = env.payments.stripeSecretKey();
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formEncode({
        mode: "payment",
        success_url: `${request.successUrl}${request.successUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: request.cancelUrl,
        customer_email: request.customerEmail,
        client_reference_id: request.orderId,
        "line_items[0][quantity]": 1,
        "line_items[0][price_data][currency]": request.currency.toLowerCase(),
        "line_items[0][price_data][unit_amount]": request.amountCents,
        "line_items[0][price_data][product_data][name]": request.courseTitle,
        "metadata[orderId]": request.orderId,
        "metadata[courseSlug]": request.courseSlug,
      }),
    });

    const body = (await response.json()) as {
      id?: string;
      url?: string;
      error?: { message?: string };
    };
    if (!response.ok || !body.url || !body.id) {
      throw new Error(body.error?.message ?? "Stripe checkout session could not be created");
    }
    return { redirectUrl: body.url, providerRef: body.id };
  },

  async verify(providerRef) {
    const key = env.payments.stripeSecretKey();
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");

    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(providerRef)}`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    if (!response.ok) return { paid: false };

    const body = (await response.json()) as {
      payment_status?: string;
      amount_total?: number;
      currency?: string;
    };
    return {
      paid: body.payment_status === "paid",
      amountCents: body.amount_total,
      currency: body.currency?.toUpperCase(),
    };
  },
};

// ---------------------------------------------------------------------------
// Paystack — the practical choice for NGN / GHS / ZAR / KES learners.
// ---------------------------------------------------------------------------

const paystackGateway: PaymentGateway = {
  id: "paystack",
  label: "Card & transfer (Paystack)",

  async createCheckout(request) {
    const key = env.payments.paystackSecretKey();
    if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: request.customerEmail,
        amount: request.amountCents, // Paystack also uses minor units
        currency: request.currency,
        reference: `jiga_${request.orderId}`,
        callback_url: request.successUrl,
        metadata: { orderId: request.orderId, courseSlug: request.courseSlug },
      }),
    });

    const body = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; reference?: string };
    };
    if (!response.ok || !body.status || !body.data?.authorization_url || !body.data.reference) {
      throw new Error(body.message ?? "Paystack transaction could not be initialised");
    }
    return {
      redirectUrl: body.data.authorization_url,
      providerRef: body.data.reference,
    };
  },

  async verify(providerRef) {
    const key = env.payments.paystackSecretKey();
    if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(providerRef)}`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    if (!response.ok) return { paid: false };

    const body = (await response.json()) as {
      status?: boolean;
      data?: { status?: string; amount?: number; currency?: string };
    };
    return {
      paid: body.status === true && body.data?.status === "success",
      amountCents: body.data?.amount,
      currency: body.data?.currency,
    };
  },
};

const GATEWAYS: Record<string, PaymentGateway> = {
  mock: mockGateway,
  stripe: stripeGateway,
  paystack: paystackGateway,
};

export function getGateway(): PaymentGateway {
  return GATEWAYS[env.payments.provider()] ?? mockGateway;
}
