/**
 * Environment access with sane development fallbacks.
 *
 * Anything security-relevant fails loudly in production rather than falling
 * back to a default — a predictable session secret is worse than a crash.
 */

const isProd = process.env.NODE_ENV === "production";

function required(name: string, devFallback?: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (!isProd && devFallback !== undefined) return devFallback;
  throw new Error(
    `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
  );
}

export const env = {
  isProd,

  sessionSecret: () =>
    required("SESSION_SECRET", "dev-only-insecure-session-secret-change-me-32b"),

  /**
   * Absolute origin, used to build payment redirect URLs and certificate
   * links. Reads APP_URL first: `NEXT_PUBLIC_*` values are inlined into the
   * bundle at build time, so relying on one would freeze the URL of whatever
   * machine ran `next build` — which breaks the moment the same image is
   * deployed to staging and production.
   */
  appUrl: () =>
    (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
      .replace(/\/$/, ""),

  payments: {
    provider: () =>
      (process.env.PAYMENTS_PROVIDER ?? "mock").toLowerCase() as
        | "mock"
        | "stripe"
        | "paystack",
    currency: () => (process.env.PAYMENTS_CURRENCY ?? "USD").toUpperCase(),
    stripeSecretKey: () => process.env.STRIPE_SECRET_KEY ?? "",
    stripeWebhookSecret: () => process.env.STRIPE_WEBHOOK_SECRET ?? "",
    paystackSecretKey: () => process.env.PAYSTACK_SECRET_KEY ?? "",
  },
};
