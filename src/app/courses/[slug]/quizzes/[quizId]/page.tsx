import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { canAccessCourse } from "@/lib/access";
import { gradeQuiz, parseAnswers } from "@/lib/quiz";
import { Alert, Badge, Button, ButtonLink, Card, cx } from "@/components/ui";
import { submitQuizAction } from "@/server/actions/learning";

export const metadata: Metadata = { title: "Quiz" };

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; quizId: string }>;
  searchParams: Promise<{ attempt?: string; error?: string }>;
}) {
  const { slug, quizId } = await params;
  const { attempt: attemptId, error } = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/courses/${slug}/quizzes/${quizId}`);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      course: { select: { id: true, slug: true, title: true } },
      module: { select: { title: true } },
      questions: {
        orderBy: { position: "asc" },
        include: { choices: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!quiz || quiz.course.slug !== slug) notFound();

  if (!(await canAccessCourse(user, quiz.course.id))) {
    redirect(`/courses/${slug}`);
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId: quiz.id, userId: user.id, submittedAt: { not: null } },
    orderBy: { submittedAt: "desc" },
  });

  const bestScore = attempts.reduce((best, a) => Math.max(best, a.scorePercent), -1);
  const hasPassed = bestScore >= quiz.passMark;
  const attemptsLeft = quiz.maxAttempts - attempts.length;

  const shown = attemptId ? attempts.find((a) => a.id === attemptId) : null;

  const header = (
    <header>
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-400">
        <Link href={`/courses/${slug}`} className="hover:text-ink-700">
          {quiz.course.title}
        </Link>
        {quiz.module ? (
          <>
            <span aria-hidden>/</span>
            <span>{quiz.module.title}</span>
          </>
        ) : null}
      </nav>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900">
        {quiz.title}
      </h1>
      {quiz.description ? <p className="mt-2 text-ink-500">{quiz.description}</p> : null}
      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-400">
        <span>{quiz.questions.length} questions</span>
        <span aria-hidden>·</span>
        <span>Pass mark {quiz.passMark}%</span>
        {quiz.timeLimitMinutes ? (
          <>
            <span aria-hidden>·</span>
            <span>Suggested time {quiz.timeLimitMinutes} minutes</span>
          </>
        ) : null}
        <span aria-hidden>·</span>
        <span>
          {attempts.length} of {quiz.maxAttempts} attempts used
        </span>
      </p>
    </header>
  );

  // ------------------------------------------------------------- results view
  if (shown) {
    const answers = parseAnswers(shown.answersJson);
    const graded = gradeQuiz(
      quiz.questions.map((q) => ({ id: q.id, points: q.points, choices: q.choices })),
      answers,
    );
    const resultById = new Map(graded.results.map((r) => [r.questionId, r]));

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {header}

        <Card className="mt-8 p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-ink-500">Your score</p>
              <p
                className={cx(
                  "text-5xl font-semibold tracking-tight",
                  shown.passed ? "text-moss-500" : "text-ink-900",
                )}
              >
                {shown.scorePercent}%
              </p>
              <p className="mt-1 text-sm text-ink-400">
                {graded.correctCount} of {graded.questionCount} questions correct
              </p>
            </div>
            <Badge tone={shown.passed ? "moss" : "red"}>
              {shown.passed ? "Passed" : `Below the ${quiz.passMark}% pass mark`}
            </Badge>
          </div>

          {!shown.passed ? (
            <div className="mt-6">
              <Alert tone="warning" title="Your best attempt is the one that counts">
                Read the explanations below, go back over the lesson, and try again.
                Nothing about this attempt is held against you.
              </Alert>
            </div>
          ) : null}
        </Card>

        <ol className="mt-8 space-y-5">
          {quiz.questions.map((question, index) => {
            const result = resultById.get(question.id);
            const selected = new Set(result?.selectedIds ?? []);

            return (
              <li key={question.id}>
                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={cx(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                        result?.isCorrect ? "bg-moss-500" : "bg-red-500",
                      )}
                    >
                      {result?.isCorrect ? "✓" : "✕"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink-900">
                        {index + 1}. {question.prompt}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {question.choices.map((choice) => {
                          const picked = selected.has(choice.id);
                          return (
                            <li
                              key={choice.id}
                              className={cx(
                                "flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm ring-1 ring-inset",
                                choice.isCorrect
                                  ? "bg-moss-50 text-ink-800 ring-moss-500/25"
                                  : picked
                                    ? "bg-red-50 text-ink-800 ring-red-200"
                                    : "text-ink-500 ring-transparent",
                              )}
                            >
                              <span aria-hidden className="mt-0.5">
                                {choice.isCorrect ? "✓" : picked ? "✕" : "·"}
                              </span>
                              <span>{choice.text}</span>
                              {picked ? (
                                <span className="ml-auto shrink-0 text-[11px] uppercase tracking-wide text-ink-400">
                                  your answer
                                </span>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>

                      {question.explanation ? (
                        <p className="mt-4 border-l-2 border-gold-400 pl-4 text-sm leading-relaxed text-ink-600">
                          {question.explanation}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={`/courses/${slug}`} size="lg">
            Back to the course
          </ButtonLink>
          {!hasPassed && attemptsLeft > 0 ? (
            <ButtonLink
              href={`/courses/${slug}/quizzes/${quiz.id}`}
              size="lg"
              variant="secondary"
            >
              Try again ({attemptsLeft} left)
            </ButtonLink>
          ) : null}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------- attempt exhausted
  if (attemptsLeft <= 0 && !hasPassed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {header}
        <div className="mt-8">
          <Alert tone="error" title="No attempts left">
            You have used all {quiz.maxAttempts} attempts on this quiz. Contact your
            instructor in the community and they can reset it for you.
          </Alert>
        </div>
        <ButtonLink href={`/courses/${slug}`} size="lg" className="mt-8">
          Back to the course
        </ButtonLink>
      </div>
    );
  }

  // -------------------------------------------------------------- attempt form
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {header}

      {error === "attempts" ? (
        <div className="mt-6">
          <Alert tone="error">You have no attempts left on this quiz.</Alert>
        </div>
      ) : null}

      {hasPassed ? (
        <div className="mt-6">
          <Alert tone="success" title={`Already passed with ${bestScore}%`}>
            You can retake this to improve your score — your best attempt is the one that
            counts, so there is nothing to lose.
          </Alert>
        </div>
      ) : null}

      {attempts.length > 0 ? (
        <Card className="mt-6 p-5">
          <p className="text-sm font-semibold text-ink-900">Previous attempts</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {attempts.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <Link
                  href={`/courses/${slug}/quizzes/${quiz.id}?attempt=${a.id}`}
                  className="text-ink-600 underline underline-offset-4 hover:text-ink-900"
                >
                  Review this attempt
                </Link>
                <Badge tone={a.passed ? "moss" : "neutral"}>{a.scorePercent}%</Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <form action={submitQuizAction} className="mt-8">
        <input type="hidden" name="quizId" value={quiz.id} />

        <ol className="space-y-5">
          {quiz.questions.map((question, index) => {
            const isMulti = question.type === "MULTI";
            return (
              <li key={question.id}>
                <Card className="p-6">
                  <fieldset>
                    <legend className="font-medium text-ink-900">
                      {index + 1}. {question.prompt}
                    </legend>
                    <p className="mt-1 text-xs text-ink-400">
                      {isMulti ? "Select all that apply" : "Select one"}
                    </p>

                    <div className="mt-4 space-y-2">
                      {question.choices.map((choice) => (
                        <label
                          key={choice.id}
                          className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-700 ring-1 ring-inset ring-sand-200 transition-colors hover:bg-ink-50 has-[:checked]:bg-ink-50 has-[:checked]:ring-ink-400"
                        >
                          <input
                            type={isMulti ? "checkbox" : "radio"}
                            name={`q_${question.id}`}
                            value={choice.id}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-ink-900"
                          />
                          <span>{choice.text}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </Card>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg">
            Submit answers
          </Button>
          <p className="text-sm text-ink-400">
            {attemptsLeft} of {quiz.maxAttempts} attempts remaining. Unanswered questions
            score zero.
          </p>
        </div>
      </form>
    </div>
  );
}
