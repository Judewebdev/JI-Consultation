import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/lib/env";
import { formatPrice } from "@/lib/format";
import { Alert, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Test payment", robots: { index: false } };

/**
 * A stand-in for a provider's hosted checkout page.
 *
 * It exists so the flow the team demos is the same flow that runs against
 * Stripe or Paystack: leave the app, approve or decline, come back to the
 * confirm route, which verifies before granting access. Only reachable when
 * PAYMENTS_PROVIDER is "mock".
 */
export default async function MockPaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (env.payments.provider() !== "mock") notFound();

  const query = await searchParams;
  const read = (key: string) => {
    const value = query[key];
    return typeof value === "string" ? value : "";
  };

  const amount = Number(read("amount")) || 0;
  const currency = read("currency") || "USD";
  const courseTitle = read("course");

  // Only ever send the browser back to this app, whatever the URL says.
  const sameOrigin = (raw: string, fallback: string) => {
    try {
      const url = new URL(raw, env.appUrl());
      return url.origin === new URL(env.appUrl()).origin ? url.toString() : fallback;
    } catch {
      return fallback;
    }
  };

  const successUrl = sameOrigin(read("success"), "/dashboard");
  const cancelUrl = sameOrigin(read("cancel"), "/courses");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
          Test payment gateway
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">
          Confirm your payment
        </h1>
      </div>

      <Card className="mt-8 p-7">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Paying</dt>
            <dd className="text-right font-medium text-ink-900">JI Global Academy</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">For</dt>
            <dd className="text-right font-medium text-ink-900">{courseTitle || "Course"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-sand-200 pt-3 text-base">
            <dt className="font-semibold text-ink-900">Amount</dt>
            <dd className="font-semibold text-ink-900">{formatPrice(amount, currency)}</dd>
          </div>
        </dl>

        <div className="mt-7 rounded-xl bg-sand-100 p-5 ring-1 ring-inset ring-sand-200">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Card details
          </p>
          <p className="mt-2 font-mono text-lg tracking-widest text-ink-300">
            •••• •••• •••• 4242
          </p>
          <p className="mt-1 text-xs text-ink-400">
            No card is taken. This page simulates the provider so the redirect flow can be
            tested end to end.
          </p>
        </div>

        {/*
          Plain anchors, not next/link. Leaving the "provider" has to be a real
          navigation: the confirm route answers with a redirect, and a
          client-side RSC fetch would follow it internally and drop the query
          string it lands on — exactly as a real provider's redirect would not.
        */}
        <div className="mt-7 space-y-3">
          <a
            href={successUrl}
            className="inline-flex w-full items-center justify-center rounded-lg bg-ink-900 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-ink-800"
          >
            Approve payment
          </a>
          <a
            href={cancelUrl}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-ink-900 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50"
          >
            Decline and go back
          </a>
        </div>
      </Card>

      <div className="mt-8">
        <Alert tone="warning" title="Development mode">
          Approving here marks the order paid and grants enrolment. Switch{" "}
          <code className="font-mono">PAYMENTS_PROVIDER</code> to{" "}
          <code className="font-mono">stripe</code> or{" "}
          <code className="font-mono">paystack</code> in your environment to take real
          payments — no application code changes.
        </Alert>
      </div>
    </div>
  );
}
