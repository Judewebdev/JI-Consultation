import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getCurrentUser()) redirect("/dashboard");

  const { next } = await searchParams;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Welcome back</h1>
      <p className="mt-2 text-ink-500">
        Sign in to pick up where you left off.{" "}
        <Link
          href="/register"
          className="font-medium text-ink-800 underline underline-offset-4"
        >
          Need an account?
        </Link>
      </p>

      <div className="mt-8">
        <LoginForm next={next && next.startsWith("/") ? next : undefined} />
      </div>

      <div className="mt-8 rounded-lg bg-sand-100 px-4 py-3.5 text-xs leading-relaxed text-ink-500 ring-1 ring-inset ring-sand-200">
        <span className="font-semibold text-ink-700">Demo data.</span> If you seeded this
        instance, sign in as <code className="font-mono">student@example.com</code> with
        the password from your <code className="font-mono">.env</code> to see a populated
        account.
      </div>
    </div>
  );
}
