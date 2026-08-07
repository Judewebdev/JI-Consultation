import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { formatDuration } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { Alert, Badge, Button, ButtonLink, Card, ProgressBar, cx } from "@/components/ui";
import { ResourceList } from "@/components/resource-list";
import { loadCourse, loadViewer, flattenLessons } from "@/server/course-data";
import { setLessonCompleteAction } from "@/server/actions/learning";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const course = await loadCourse(slug);
  const lesson = course && flattenLessons(course).find((l) => l.slug === lessonSlug);
  return lesson
    ? { title: `${lesson.title} · ${course!.title}` }
    : { title: "Lesson not found" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;

  const course = await loadCourse(slug);
  if (!course || !course.published) notFound();

  const lessons = flattenLessons(course);
  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) notFound();

  const lesson = lessons[index]!;
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;

  const user = await getCurrentUser();
  const viewer = await loadViewer(user, course.id);

  // Preview lessons are the taster in the catalog; everything else needs access.
  if (!viewer.hasAccess && !lesson.isPreview) {
    return <LockedLesson courseSlug={course.slug} courseTitle={course.title} />;
  }

  const completed = viewer.progress?.completedLessonIds ?? new Set<string>();
  const isDone = completed.has(lesson.id);
  const lessonHref = `/courses/${course.slug}/learn/`;

  // The module this lesson belongs to, for the quiz/assignment prompts below.
  const owningModule = course.modules.find((m) => m.id === lesson.moduleId)!;
  const isLastOfModule =
    owningModule.lessons[owningModule.lessons.length - 1]?.id === lesson.id;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-12">
      {/* ------------------------------------------------------------ main */}
      <div className="min-w-0">
        <nav className="flex items-center gap-2 text-sm text-ink-400">
          <Link href="/courses" className="hover:text-ink-700">
            Courses
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-ink-700">
            {course.title}
          </Link>
        </nav>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
          {lesson.moduleTitle}
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-ink-900 lg:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-400">
          <span>Lesson {index + 1} of {lessons.length}</span>
          <span aria-hidden>·</span>
          <span>{formatDuration(lesson.durationMinutes)}</span>
          <span aria-hidden>·</span>
          <span>{lesson.resources.length} downloads</span>
          {isDone ? (
            <>
              <span aria-hidden>·</span>
              <Badge tone="moss">Completed</Badge>
            </>
          ) : null}
        </p>

        {/* video */}
        <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] bg-ink-900">
          <div className="flex aspect-video items-center justify-center">
            <div className="px-6 text-center">
              <span
                aria-hidden
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl text-white ring-1 ring-white/20"
              >
                ▶
              </span>
              <p className="mt-4 text-sm font-medium text-white">{lesson.title}</p>
              <p className="mt-1 text-xs text-ink-300">
                {lesson.videoUrl
                  ? "Connect your video host to play this lesson"
                  : "No video uploaded for this lesson yet"}
              </p>
            </div>
          </div>
        </div>

        {lesson.summary ? (
          <p className="mt-8 border-l-2 border-gold-400 pl-5 text-lg leading-relaxed text-ink-600">
            {lesson.summary}
          </p>
        ) : null}

        <article
          className="prose-lesson mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.contentMd) }}
        />

        {/* downloads */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">
            Download pack
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Open these while you work, not afterwards. They are generated from the same
            source as this lesson, so they cannot contradict it.
          </p>
          <div className="mt-5">
            <ResourceList resources={lesson.resources} locked={!viewer.hasAccess} />
          </div>
        </section>

        {/* mark complete / navigation */}
        <div className="mt-14 border-t border-sand-200 pt-8">
          {viewer.enrollment ? (
            <form action={setLessonCompleteAction} className="flex flex-wrap gap-3">
              <input type="hidden" name="lessonId" value={lesson.id} />
              <input type="hidden" name="complete" value={String(!isDone)} />
              {!isDone && next ? (
                <input type="hidden" name="next" value={`${lessonHref}${next.slug}`} />
              ) : null}
              <Button type="submit" size="lg" variant={isDone ? "secondary" : "primary"}>
                {isDone
                  ? "Mark as not complete"
                  : next
                    ? "Mark complete and continue"
                    : "Mark complete"}
              </Button>
              {!isDone && next ? (
                <ButtonLink
                  href={`${lessonHref}${next.slug}`}
                  size="lg"
                  variant="ghost"
                  className="ring-1 ring-inset ring-sand-200"
                >
                  Skip for now
                </ButtonLink>
              ) : null}
            </form>
          ) : (
            <Alert tone="warning" title="You are viewing a free preview">
              Enrol in the course to track progress, download the full pack and take the
              quizzes.
            </Alert>
          )}

          {isLastOfModule && viewer.hasAccess ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {owningModule.quizzes[0] ? (
                <NextStepCard
                  href={`/courses/${course.slug}/quizzes/${owningModule.quizzes[0].id}`}
                  eyebrow="End of module"
                  title={owningModule.quizzes[0].title}
                  body={`Pass mark ${owningModule.quizzes[0].passMark}%. Take it now while the material is fresh.`}
                />
              ) : null}
              {owningModule.assignments[0] ? (
                <NextStepCard
                  href={`/courses/${course.slug}/assignments/${owningModule.assignments[0].id}`}
                  eyebrow="Assignment"
                  title={owningModule.assignments[0].title}
                  body="Applied to your own business. Submit before moving on, even if it is not perfect."
                />
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-4 text-sm">
            {previous ? (
              <Link
                href={`${lessonHref}${previous.slug}`}
                className="text-ink-500 hover:text-ink-900"
              >
                ← {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`${lessonHref}${next.slug}`}
                className="text-right text-ink-500 hover:text-ink-900"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="overflow-hidden">
          <div className="border-b border-sand-200 px-5 py-4">
            <p className="text-sm font-semibold text-ink-900">{course.title}</p>
            {viewer.progress ? (
              <>
                <div className="mt-3">
                  <ProgressBar percent={viewer.progress.percent} />
                </div>
                <p className="mt-2 text-xs text-ink-400">
                  {viewer.progress.itemsDone} of {viewer.progress.itemsTotal} items ·{" "}
                  {viewer.progress.percent}%
                </p>
              </>
            ) : null}
          </div>

          <nav className="max-h-[60vh] overflow-y-auto px-2 py-3">
            {course.modules.map((courseModule, moduleIndex) => (
              <div key={courseModule.id} className="mb-2">
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-400">
                  {moduleIndex + 1}. {courseModule.title}
                </p>
                <ul>
                  {courseModule.lessons.map((item) => {
                    const done = completed.has(item.id);
                    const active = item.id === lesson.id;
                    const openable = viewer.hasAccess || item.isPreview;

                    return (
                      <li key={item.id}>
                        {openable ? (
                          <Link
                            href={`${lessonHref}${item.slug}`}
                            aria-current={active ? "page" : undefined}
                            className={cx(
                              "flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                              active
                                ? "bg-ink-900 text-white"
                                : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cx(
                                "mt-0.5 text-[11px]",
                                done
                                  ? "text-moss-500"
                                  : active
                                    ? "text-white/50"
                                    : "text-ink-300",
                              )}
                            >
                              {done ? "✓" : "○"}
                            </span>
                            <span className="min-w-0 flex-1">{item.title}</span>
                          </Link>
                        ) : (
                          <span className="flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-300">
                            <span aria-hidden className="mt-0.5 text-[11px]">
                              🔒
                            </span>
                            <span className="min-w-0 flex-1">{item.title}</span>
                          </span>
                        )}
                      </li>
                    );
                  })}

                  {courseModule.quizzes[0] && viewer.hasAccess ? (
                    <li>
                      <Link
                        href={`/courses/${course.slug}/quizzes/${courseModule.quizzes[0].id}`}
                        className="flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-500 hover:bg-ink-50 hover:text-ink-900"
                      >
                        <span aria-hidden className="mt-0.5 text-[11px] text-gold-500">
                          ?
                        </span>
                        <span className="min-w-0 flex-1">Module quiz</span>
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-sand-200 px-5 py-4">
            <Link
              href={`/courses/${course.slug}`}
              className="text-sm font-medium text-ink-600 hover:text-ink-900"
            >
              Course overview →
            </Link>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function NextStepCard({
  href,
  eyebrow,
  title,
  body,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-inset ring-sand-200 transition-colors hover:ring-ink-300"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-600">
        {eyebrow}
      </p>
      <p className="mt-1.5 font-semibold text-ink-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-500">{body}</p>
    </Link>
  );
}

function LockedLesson({
  courseSlug,
  courseTitle,
}: {
  courseSlug: string;
  courseTitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <span aria-hidden className="text-4xl">
        🔒
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900">
        This lesson is part of {courseTitle}
      </h1>
      <p className="mt-4 text-ink-500">
        Enrol to unlock every lesson, the full download pack, the assignments and the
        certificate.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href={`/courses/${courseSlug}`} size="lg">
          View the course
        </ButtonLink>
        <ButtonLink href="/courses" size="lg" variant="secondary">
          Back to catalog
        </ButtonLink>
      </div>
    </div>
  );
}
