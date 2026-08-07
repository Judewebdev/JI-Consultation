"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitAssignmentAction, type ActionState } from "@/server/actions/learning";
import { Alert, Button, Field, inputClass } from "./ui";

function Submit({ hasSubmission }: { hasSubmission: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending
        ? "Submitting…"
        : hasSubmission
          ? "Replace my submission"
          : "Submit assignment"}
    </Button>
  );
}

export function AssignmentForm({
  assignmentId,
  initialContent,
  initialLink,
  hasSubmission,
}: {
  assignmentId: string;
  initialContent: string;
  initialLink: string;
  hasSubmission: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    submitAssignmentAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="assignmentId" value={assignmentId} />

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Field
        label="Your submission"
        hint="Markdown is supported. Write it against your own business — abstract answers get returned."
      >
        <textarea
          name="contentMd"
          rows={16}
          required
          minLength={80}
          defaultValue={initialContent}
          className={`${inputClass} font-normal leading-relaxed`}
          placeholder={
            "## What I did\n\n…\n\n## The numbers\n\n…\n\n## What changes this week\n\n1. "
          }
        />
      </Field>

      <Field
        label="Supporting link (optional)"
        hint="A shared document, spreadsheet or folder, if your work does not fit above."
      >
        <input
          name="linkUrl"
          type="url"
          defaultValue={initialLink}
          className={inputClass}
          placeholder="https://"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <Submit hasSubmission={hasSubmission} />
        {hasSubmission ? (
          <p className="text-sm text-ink-400">
            Replacing your submission clears the previous grade — the work being marked
            has changed.
          </p>
        ) : null}
      </div>
    </form>
  );
}
