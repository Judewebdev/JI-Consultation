"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, registerAction, type AuthState } from "@/server/actions/auth";
import { Alert, Button, Field, inputClass } from "./ui";

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Just a moment…" : children}
    </Button>
  );
}

const EMPTY: AuthState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, EMPTY);

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Field label="Email address" error={state.fieldErrors?.email}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="you@company.com"
        />
      </Field>

      <Field label="Password" error={state.fieldErrors?.password}>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>

      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, EMPTY);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Field label="Full name" error={state.fieldErrors?.name}>
        <input
          name="name"
          autoComplete="name"
          required
          className={inputClass}
          placeholder="Ama Serwaa"
        />
      </Field>

      <Field label="Email address" error={state.fieldErrors?.email}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="you@company.com"
        />
      </Field>

      <Field
        label="Password"
        hint="At least 10 characters."
        error={state.fieldErrors?.password}
      >
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="What you do"
          hint="Shown beside your community posts."
          error={state.fieldErrors?.headline}
        >
          <input
            name="headline"
            className={inputClass}
            placeholder="Operations consultant"
          />
        </Field>

        <Field label="Country" error={state.fieldErrors?.country}>
          <input name="country" autoComplete="country-name" className={inputClass} />
        </Field>
      </div>

      <SubmitButton>Create account</SubmitButton>

      <p className="text-xs leading-relaxed text-ink-400">
        We will enrol you in the free Academy Orientation course straight away, so you
        have somewhere to start.
      </p>
    </form>
  );
}
