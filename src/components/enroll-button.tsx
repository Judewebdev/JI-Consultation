"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { enrollFreeAction, type ActionState } from "@/server/actions/learning";
import { startCheckoutAction, type CheckoutState } from "@/server/actions/payments";
import { Alert, Button } from "./ui";

const EMPTY = {};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "One moment…" : label}
    </Button>
  );
}

export function EnrollFreeButton({ slug, label }: { slug: string; label: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    enrollFreeAction,
    EMPTY,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="slug" value={slug} />
      <Submit label={label} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
    </form>
  );
}

export function CheckoutButton({ slug, label }: { slug: string; label: string }) {
  const [state, formAction] = useActionState<CheckoutState, FormData>(
    startCheckoutAction,
    EMPTY,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="slug" value={slug} />
      <Submit label={label} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
    </form>
  );
}
