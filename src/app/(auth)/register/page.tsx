import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Create your account" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
        Create your account
      </h1>
      <p className="mt-2 text-ink-500">
        Free to join, and Orientation is free to finish.{" "}
        <Link href="/login" className="font-medium text-ink-800 underline underline-offset-4">
          Already registered?
        </Link>
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
