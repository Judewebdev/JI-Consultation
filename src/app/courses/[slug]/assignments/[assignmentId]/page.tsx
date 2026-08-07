import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { canAccessCourse } from "@/lib/access";
import { parseStringList } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { Alert, Badge, ButtonLink, Card } from "@/components/ui";
import { AssignmentForm } from "@/components/assignment-form";

export const metadata: Metadata = { title: "Assignment" };

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ slug: string; assignmentId: string }>;
}) {
  const { slug, assignmentId } = await params;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/courses/${slug}/assignments/${assignmentId}`);

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: { select: { id: true, slug: true, title: true } },
      module: { select: { title: true } },
    },
  });
  if (!assignment || assignment.course.slug !== slug) notFound();

  if (!(await canAccessCourse(user, assignment.course.id))) {
    redirect(`/courses/${slug}`);
  }

  const [submission, enrollment] = await Promise.all([
    prisma.assignmentSubmission.findUnique({
      where: { assignmentId_userId: { assignmentId, userId: user.id } },
      include: { gradedBy: { select: { name: true } } },
    }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: assignment.course.id } },
      select: { enrolledAt: true },
    }),
  ]);

  const deliverables = parseStringList(assignment.deliverables);
  const dueDate = enrollment
    ? new Date(enrollment.enrolledAt.getTime() + assignment.dueInDays * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-400">
        <Link href={`/courses/${slug}`} className="hover:text-ink-700">
          {assignment.course.title}
        </Link>
        <span aria-hidden>/</span>
        <span>{assignment.module?.title ?? "Capstone"}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          {assignment.title}
        </h1>
        {submission ? (
          <Badge
            tone={
              submission.status === "GRADED"
                ? "moss"
                : submission.status === "RETURNED"
                  ? "red"
                  : "gold"
            }
          >
            {submission.status === "GRADED"
              ? `Graded — ${submission.grade}/${assignment.points}`
              : submission.status === "RETURNED"
                ? "Returned for rework"
                : "Submitted"}
          </Badge>
        ) : null}
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-400">
        <span>{assignment.points} points</span>
        {dueDate ? (
          <>
            <span aria-hidden>·</span>
            <span>Suggested by {formatDate(dueDate)}</span>
          </>
        ) : null}
      </p>

      <Card className="mt-8 p-7">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-600">
          The brief
        </h2>
        <div
          className="prose-lesson prose-compact mt-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(assignment.briefMd) }}
        />

        {deliverables.length ? (
          <div className="mt-7 border-t border-sand-200 pt-6">
            <h3 className="text-sm font-semibold text-ink-900">What to hand in</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {deliverables.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden className="text-ink-300">
                    ☐
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      {submission?.feedback ? (
        <Card className="mt-6 border-l-4 border-l-moss-500 p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-moss-600">
              Feedback
            </h2>
            <p className="text-xs text-ink-400">
              {submission.gradedBy ? `${submission.gradedBy.name} · ` : ""}
              {formatDate(submission.gradedAt)}
            </p>
          </div>
          <div
            className="prose-lesson prose-compact mt-4"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(submission.feedback) }}
          />
          {submission.grade !== null ? (
            <p className="mt-5 border-t border-sand-200 pt-4 text-sm text-ink-600">
              <span className="font-semibold text-ink-900">
                {submission.grade} / {assignment.points}
              </span>{" "}
              points awarded.
            </p>
          ) : null}
        </Card>
      ) : null}

      {submission?.status === "RETURNED" ? (
        <div className="mt-6">
          <Alert tone="warning" title="This was returned for rework">
            Read the feedback above, then replace your submission below. Returned work
            does not count towards course completion until it is resubmitted.
          </Alert>
        </div>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-ink-900">
          {submission ? "Your submission" : "Submit your work"}
        </h2>
        {submission ? (
          <p className="mt-1.5 text-sm text-ink-400">
            Submitted {formatDate(submission.submittedAt)}. You can replace it at any time.
          </p>
        ) : null}

        <div className="mt-6">
          <AssignmentForm
            assignmentId={assignment.id}
            initialContent={submission?.contentMd ?? ""}
            initialLink={submission?.linkUrl ?? ""}
            hasSubmission={Boolean(submission)}
          />
        </div>
      </section>

      <div className="mt-12 border-t border-sand-200 pt-8">
        <ButtonLink href={`/courses/${slug}`} variant="secondary">
          Back to the course
        </ButtonLink>
      </div>
    </div>
  );
}
