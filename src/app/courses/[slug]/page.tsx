import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { formatDuration, formatPrice } from "@/lib/format";
import { parseStringList } from "@/lib/enums";
import { renderMarkdown } from "@/lib/markdown";
import { Alert, Badge, ButtonLink, Card, ProgressBar } from "@/components/ui";
import { CheckoutButton, EnrollFreeButton } from "@/components/enroll-button";
import { ResourceList } from "@/components/resource-list";
import { loadCourse, loadViewer, flattenLessons } from "@/server/course-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await loadCourse(slug);
  if (!course) return { title: "Course not found" };
  return { title: course.title, description: course.subtitle };
}

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { slug } = await params;
  const { welcome } = await searchParams;

  const course = await loadCourse(slug);
  if (!course || !course.published) notFound();

  const user = await getCurrentUser();
  const viewer = await loadViewer(user, course.id);

  const outcomes = parseStringList(course.outcomesJson);
  const requirements = parseStringList(course.requirementsJson);
  const lessons = flattenLessons(course);
  const totalMinutes = lessons.reduce((sum, l) => sum + l.durationMinutes, 0);
  const downloadCount =
    course.resources.length +
    course.modules.reduce(
      (sum, m) => sum + m.lessons.reduce((s, l) => s + l.resources.length, 0),
      0,
    );

  const completed = viewer.progress?.completedLessonIds ?? new Set<string>();
  const nextLesson = lessons.find((l) => !completed.has(l.id)) ?? lessons[0];
  const finalQuiz = course.quizzes[0];
  const capstone = course.assignments[0];

  return (
    <div>
      {/* ------------------------------------------------------------- hero */}
      <div className="border-b border-sand-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{course.category}</Badge>
                <Badge tone="neutral">{course.level.toLowerCase()}</Badge>
                {course.priceCents === 0 ? <Badge tone="moss">Free</Badge> : null}
                {viewer.enrollment ? (
                  <Badge tone="gold">
                    {viewer.enrollment.status === "COMPLETED" ? "Completed" : "Enrolled"}
                  </Badge>
                ) : null}
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-tight text-ink-900 lg:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 text-xl leading-relaxed text-ink-500">{course.subtitle}</p>

              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <Meta label="Modules" value={String(course.modules.length)} />
                <Meta label="Lessons" value={String(lessons.length)} />
                <Meta label="Downloads" value={String(downloadCount)} />
                <Meta label="Video" value={formatDuration(totalMinutes)} />
                <Meta label="Enrolled" value={String(course._count.enrollments)} />
              </dl>

              {course.instructor ? (
                <p className="mt-8 text-sm text-ink-500">
                  Taught by{" "}
                  <span className="font-semibold text-ink-800">
                    {course.instructor.name}
                  </span>
                  {course.instructor.headline ? ` · ${course.instructor.headline}` : null}
                </p>
              ) : null}
            </div>

            {/* ------------------------------------------------ enrol card */}
            <div className="lg:pt-2">
              <Card className="p-6">
                {welcome ? (
                  <div className="mb-5">
                    <Alert tone="success" title="Payment received">
                      You are enrolled. Everything below is now unlocked.
                    </Alert>
                  </div>
                ) : null}

                {viewer.enrollment ? (
                  <>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-sm font-medium text-ink-700">Your progress</span>
                      <span className="text-sm text-ink-400">
                        {viewer.progress?.percent ?? 0}%
                      </span>
                    </div>
                    <ProgressBar percent={viewer.progress?.percent ?? 0} />
                    <p className="mt-3 text-xs text-ink-400">
                      {viewer.progress?.itemsDone ?? 0} of {viewer.progress?.itemsTotal ?? 0}{" "}
                      items finished — lessons, quizzes and assignments.
                    </p>

                    {nextLesson ? (
                      <ButtonLink
                        href={`/courses/${course.slug}/learn/${nextLesson.slug}`}
                        size="lg"
                        className="mt-6 w-full"
                      >
                        {completed.size === 0 ? "Start the course" : "Continue"}
                      </ButtonLink>
                    ) : null}

                    {viewer.enrollment.status === "COMPLETED" ? (
                      <ButtonLink
                        href="/certificates"
                        variant="secondary"
                        className="mt-3 w-full"
                      >
                        View your certificate
                      </ButtonLink>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-semibold tracking-tight text-ink-900">
                      {formatPrice(course.priceCents, course.currency)}
                    </p>
                    <p className="mt-1 text-sm text-ink-500">
                      {course.priceCents === 0
                        ? "No card required."
                        : "One payment. Lifetime access, including updates."}
                    </p>

                    <div className="mt-6">
                      {!user ? (
                        <ButtonLink
                          href={`/login?next=/courses/${course.slug}`}
                          size="lg"
                          className="w-full"
                        >
                          Sign in to enrol
                        </ButtonLink>
                      ) : course.priceCents === 0 ? (
                        <EnrollFreeButton slug={course.slug} label="Enrol — it's free" />
                      ) : (
                        <CheckoutButton slug={course.slug} label="Enrol now" />
                      )}
                    </div>

                    <ul className="mt-6 space-y-2 border-t border-sand-200 pt-5 text-sm text-ink-600">
                      {[
                        `${downloadCount} downloadable working documents`,
                        `${course.assignments.length + course.modules.filter((m) => m.assignments.length).length} assignments marked with feedback`,
                        "Module quizzes with unlimited revision",
                        course.certificateEnabled
                          ? "A verifiable certificate on completion"
                          : "Full course community access",
                      ].map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span aria-hidden className="text-moss-500">
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-14">
            {/* -------------------------------------------- welcome video */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                Start here
              </h2>
              <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] bg-ink-900 ring-1 ring-ink-900">
                <div className="relative flex aspect-video items-center justify-center">
                  <div className="text-center">
                    <span
                      aria-hidden
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl text-white ring-1 ring-white/20"
                    >
                      ▶
                    </span>
                    <p className="mt-4 text-sm font-medium text-white">
                      Welcome to {course.title}
                    </p>
                    <p className="mt-1 text-xs text-ink-300">
                      {course.welcomeVideoUrl
                        ? "Video hosting is configured per environment"
                        : "No welcome video uploaded yet"}
                    </p>
                  </div>
                </div>
              </div>
              {course.welcomeVideoNote ? (
                <p className="mt-4 leading-relaxed text-ink-500">{course.welcomeVideoNote}</p>
              ) : null}
            </section>

            {/* ------------------------------------------------- overview */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                Course overview
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                {course.description}
              </p>

              {outcomes.length ? (
                <>
                  <h3 className="mt-10 text-lg font-semibold text-ink-900">
                    What you will be able to do
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-ink-700 ring-1 ring-inset ring-sand-200"
                      >
                        <span aria-hidden className="mt-0.5 text-moss-500">
                          ✓
                        </span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {requirements.length ? (
                <>
                  <h3 className="mt-10 text-lg font-semibold text-ink-900">
                    What you need before starting
                  </h3>
                  <ul className="mt-3 space-y-2 text-ink-600">
                    {requirements.map((requirement) => (
                      <li key={requirement} className="flex gap-2.5">
                        <span aria-hidden className="text-ink-300">
                          —
                        </span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>

            {/* ------------------------------------------------ curriculum */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                Curriculum
              </h2>
              <p className="mt-2 text-ink-500">
                {course.modules.length} modules · {lessons.length} lessons ·{" "}
                {downloadCount} downloads
              </p>

              <div className="mt-6 space-y-4">
                {course.modules.map((courseModule, index) => {
                  const moduleQuiz = courseModule.quizzes[0];
                  const moduleAssignment = courseModule.assignments[0];
                  const quizScore = moduleQuiz
                    ? viewer.quizScores.get(moduleQuiz.id)
                    : undefined;

                  return (
                    <Card key={courseModule.id} className="overflow-hidden">
                      <div className="border-b border-sand-200 bg-sand-50/70 px-6 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                          Module {index + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-ink-900">
                          {courseModule.title}
                        </h3>
                        {courseModule.summary ? (
                          <p className="mt-1 text-sm text-ink-500">{courseModule.summary}</p>
                        ) : null}
                      </div>

                      <ul className="divide-y divide-sand-200">
                        {courseModule.lessons.map((lesson) => {
                          const isDone = completed.has(lesson.id);
                          const canOpen = viewer.hasAccess || lesson.isPreview;

                          return (
                            <li key={lesson.id}>
                              <div className="flex items-center gap-4 px-6 py-3.5">
                                <span
                                  aria-hidden
                                  className={
                                    isDone
                                      ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss-500 text-xs text-white"
                                      : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand-100 text-[11px] text-ink-400 ring-1 ring-inset ring-sand-300"
                                  }
                                >
                                  {isDone ? "✓" : "▸"}
                                </span>

                                <div className="min-w-0 flex-1">
                                  {canOpen ? (
                                    <Link
                                      href={`/courses/${course.slug}/learn/${lesson.slug}`}
                                      className="font-medium text-ink-900 hover:underline"
                                    >
                                      {lesson.title}
                                    </Link>
                                  ) : (
                                    <span className="font-medium text-ink-700">
                                      {lesson.title}
                                    </span>
                                  )}
                                  <p className="mt-0.5 text-xs text-ink-400">
                                    {formatDuration(lesson.durationMinutes)} ·{" "}
                                    {lesson.resources.length} downloads
                                    {lesson.isPreview ? " · free preview" : ""}
                                  </p>
                                </div>

                                {!viewer.hasAccess && lesson.isPreview ? (
                                  <Badge tone="moss">Preview</Badge>
                                ) : null}
                                {!viewer.hasAccess && !lesson.isPreview ? (
                                  <span aria-label="Locked" className="text-ink-300">
                                    🔒
                                  </span>
                                ) : null}
                              </div>
                            </li>
                          );
                        })}

                        {moduleQuiz ? (
                          <li className="flex items-center gap-4 px-6 py-3.5">
                            <span
                              aria-hidden
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-[11px] text-gold-700"
                            >
                              ?
                            </span>
                            <div className="min-w-0 flex-1">
                              {viewer.hasAccess ? (
                                <Link
                                  href={`/courses/${course.slug}/quizzes/${moduleQuiz.id}`}
                                  className="font-medium text-ink-900 hover:underline"
                                >
                                  {moduleQuiz.title}
                                </Link>
                              ) : (
                                <span className="font-medium text-ink-700">
                                  {moduleQuiz.title}
                                </span>
                              )}
                              <p className="mt-0.5 text-xs text-ink-400">
                                Pass mark {moduleQuiz.passMark}% · {moduleQuiz.maxAttempts}{" "}
                                attempts
                              </p>
                            </div>
                            {quizScore !== undefined ? (
                              <Badge tone={quizScore >= moduleQuiz.passMark ? "moss" : "red"}>
                                {quizScore}%
                              </Badge>
                            ) : null}
                          </li>
                        ) : null}

                        {moduleAssignment ? (
                          <li className="flex items-center gap-4 px-6 py-3.5">
                            <span
                              aria-hidden
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[11px] text-ink-600"
                            >
                              ✎
                            </span>
                            <div className="min-w-0 flex-1">
                              {viewer.hasAccess ? (
                                <Link
                                  href={`/courses/${course.slug}/assignments/${moduleAssignment.id}`}
                                  className="font-medium text-ink-900 hover:underline"
                                >
                                  {moduleAssignment.title}
                                </Link>
                              ) : (
                                <span className="font-medium text-ink-700">
                                  {moduleAssignment.title}
                                </span>
                              )}
                              <p className="mt-0.5 text-xs text-ink-400">
                                Assignment · {moduleAssignment.points} points
                              </p>
                            </div>
                            <SubmissionBadge
                              submission={viewer.submissions.get(moduleAssignment.id)}
                            />
                          </li>
                        ) : null}
                      </ul>
                    </Card>
                  );
                })}

                {/* ---------------------------------- final assessment */}
                {finalQuiz || capstone ? (
                  <Card className="overflow-hidden">
                    <div className="border-b border-sand-200 bg-ink-900 px-6 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-300">
                        Final assessment
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        Finish the course and earn your certificate
                      </h3>
                    </div>
                    <ul className="divide-y divide-sand-200">
                      {finalQuiz ? (
                        <li className="flex items-center gap-4 px-6 py-3.5">
                          <span
                            aria-hidden
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-[11px] text-gold-700"
                          >
                            ?
                          </span>
                          <div className="min-w-0 flex-1">
                            {viewer.hasAccess ? (
                              <Link
                                href={`/courses/${course.slug}/quizzes/${finalQuiz.id}`}
                                className="font-medium text-ink-900 hover:underline"
                              >
                                {finalQuiz.title}
                              </Link>
                            ) : (
                              <span className="font-medium text-ink-700">
                                {finalQuiz.title}
                              </span>
                            )}
                            <p className="mt-0.5 text-xs text-ink-400">
                              {finalQuiz._count.questions} questions · pass mark{" "}
                              {finalQuiz.passMark}%
                              {finalQuiz.timeLimitMinutes
                                ? ` · ${finalQuiz.timeLimitMinutes} minutes`
                                : ""}
                            </p>
                          </div>
                          {viewer.quizScores.get(finalQuiz.id) !== undefined ? (
                            <Badge
                              tone={
                                viewer.quizScores.get(finalQuiz.id)! >= finalQuiz.passMark
                                  ? "moss"
                                  : "red"
                              }
                            >
                              {viewer.quizScores.get(finalQuiz.id)}%
                            </Badge>
                          ) : null}
                        </li>
                      ) : null}

                      {capstone ? (
                        <li className="flex items-center gap-4 px-6 py-3.5">
                          <span
                            aria-hidden
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[11px] text-ink-600"
                          >
                            ✎
                          </span>
                          <div className="min-w-0 flex-1">
                            {viewer.hasAccess ? (
                              <Link
                                href={`/courses/${course.slug}/assignments/${capstone.id}`}
                                className="font-medium text-ink-900 hover:underline"
                              >
                                {capstone.title}
                              </Link>
                            ) : (
                              <span className="font-medium text-ink-700">
                                {capstone.title}
                              </span>
                            )}
                            <p className="mt-0.5 text-xs text-ink-400">
                              Capstone · {capstone.points} points · due{" "}
                              {capstone.dueInDays} days after enrolling
                            </p>
                          </div>
                          <SubmissionBadge submission={viewer.submissions.get(capstone.id)} />
                        </li>
                      ) : null}
                    </ul>
                  </Card>
                ) : null}
              </div>
            </section>
          </div>

          {/* ---------------------------------------------------- sidebar */}
          <aside className="space-y-8">
            {course.resources.length ? (
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-ink-900">Course-wide downloads</h3>
                <p className="mt-1 text-xs text-ink-400">
                  Not tied to a single lesson — the pack you keep beside you.
                </p>
                <div className="mt-4">
                  <ResourceList
                    resources={course.resources}
                    locked={!viewer.hasAccess}
                    compact
                  />
                </div>
              </Card>
            ) : null}

            {course.instructor ? (
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-ink-900">Your instructor</h3>
                <p className="mt-3 font-semibold text-ink-900">{course.instructor.name}</p>
                {course.instructor.headline ? (
                  <p className="text-sm text-ink-500">{course.instructor.headline}</p>
                ) : null}
                {course.instructor.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">
                    {course.instructor.bio}
                  </p>
                ) : null}
              </Card>
            ) : null}

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-ink-900">How completion works</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Progress counts three things: lessons you mark complete, quizzes where your
                best attempt met the pass mark, and assignments you have submitted. You
                cannot reach 100% by watching alone — which is what makes the certificate
                worth something.
              </p>
              {capstone ? (
                <div
                  className="prose-lesson prose-compact mt-5 border-t border-sand-200 pt-4"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(capstone.briefMd.split("\n").slice(0, 3).join("\n")),
                  }}
                />
              ) : null}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink-900">{value}</dd>
    </div>
  );
}

function SubmissionBadge({
  submission,
}: {
  submission?: { status: string; grade: number | null };
}) {
  if (!submission) return null;
  if (submission.status === "GRADED") {
    return <Badge tone="moss">Graded {submission.grade}</Badge>;
  }
  if (submission.status === "RETURNED") return <Badge tone="red">Returned</Badge>;
  return <Badge tone="gold">Submitted</Badge>;
}
