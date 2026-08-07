"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createReplyAction,
  createThreadAction,
  type CommunityState,
} from "@/server/actions/community";
import { THREAD_CATEGORIES, THREAD_CATEGORY_LABELS } from "@/lib/enums";
import { Alert, Button, Card, Field, inputClass } from "./ui";

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function NewThreadForm({
  courses,
}: {
  courses: Array<{ id: string; title: string }>;
}) {
  const [state, formAction] = useActionState<CommunityState, FormData>(
    createThreadAction,
    {},
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-ink-900">Start a thread</h2>
      <p className="mt-1 text-sm text-ink-500">
        Context, what you tried, what happened, one question. Specific posts get
        answered; vague ones do not.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        {state.error ? <Alert tone="error">{state.error}</Alert> : null}

        <Field label="Title">
          <input
            name="title"
            required
            minLength={12}
            maxLength={140}
            className={inputClass}
            placeholder="Narrowed my positioning and immediately panicked"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select name="category" defaultValue="QUESTION" className={inputClass}>
              {THREAD_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {THREAD_CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Course"
            hint="Course threads are only visible to people on that course."
          >
            <select name="courseId" defaultValue="" className={inputClass}>
              <option value="">Academy-wide</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Your post" hint="Markdown is supported.">
          <textarea
            name="body"
            rows={9}
            required
            minLength={40}
            className={`${inputClass} leading-relaxed`}
            placeholder={
              "Context: what kind of business, what size, what market.\n\n" +
              "What I tried: the actual thing you did, with numbers.\n\n" +
              "What happened: the result, not your interpretation of it.\n\n" +
              "Question: one question, not four."
            }
          />
        </Field>

        <Submit label="Post thread" pendingLabel="Posting…" />
      </form>
    </Card>
  );
}

export function ReplyForm({ threadId }: { threadId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<CommunityState, FormData>(
    async (prev, formData) => {
      const result = await createReplyAction(prev, formData);
      if (!result.error) formRef.current?.reset();
      return result;
    },
    {},
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="threadId" value={threadId} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Field label="Your reply" hint="Be concrete. Say what you would do and why.">
        <textarea
          name="body"
          rows={6}
          required
          minLength={2}
          className={`${inputClass} leading-relaxed`}
          placeholder="What I would try, and what happened when I did…"
        />
      </Field>

      <Submit label="Post reply" pendingLabel="Posting…" />
    </form>
  );
}
