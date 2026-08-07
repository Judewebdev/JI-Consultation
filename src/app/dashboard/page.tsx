import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getCourseProgress } from "@/lib/progress";
import { formatPrice, formatRelative } from "@/lib/format";
import { THREAD_CATEGORY_LABELS, type ThreadCategory } from "@/lib/enums";
import { excerpt } from "@/lib/markdown";
import { Badge, ButtonLink, Card, EmptyState, ProgressBar, cx } from "@/components/ui";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id, status: { not: "CANCELLED" } },
    orderBy: [{ status: "asc" }, { lastAccessedAt: "desc" }],
    include: {
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          category: true,
          modules: {
            orderBy: { position: "asc" },
            select: {
              lessons: { orderBy: { position: "asc" }, select: { id: true, slug: true, title: true } },
            },
          },
        },
      },
    },
  });

  // Progress for each enrolment, plus the lesson to resume on.
  const cards = await Promise.all(
    enrollments.map(async (enrollment) => {
      const progress = await getCourseProgress(user.id, enrollment.course.id);
      const lessons = enrollment.course.modules.flatMap((m) => m.lessons);
      const nextLesson =
        lessons.find((lesson) => !progress.completedLessonIds.has(lesson.id)) ?? lessons[0];
      return { enrollment, progress, nextLesson };
    }),
  );

  const active = cards.filter((c) => c.enrollment.status === "ACTIVE");
  const completed = cards.filter((c) => c.enrollment.status === "COMPLETED");

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  const [certificates, dueAssignments, openQuizzes, threads, recommended] =
    await Promise.all([
      prisma.certificate.count({ where: { userId: user.id, revokedAt: null } }),

      // Assignments on courses you are on that you have not handed in.
      prisma.assignment.findMany({
        where: {
          courseId: { in: [...enrolledCourseIds] },
          submissions: { none: { userId: user.id } },
        },
        take: 4,
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          points: true,
          course: { select: { slug: true, title: true } },
        },
      }),

      prisma.quiz.findMany({
        where: {
          courseId: { in: [...enrolledCourseIds] },
          attempts: { none: { userId: user.id, passed: true } },
        },
        take: 4,
        select: {
          id: true,
          title: true,
          passMark: true,
          course: { select: { slug: true, title: true } },
        },
      }),

      prisma.communityThread.findMany({
        where: { OR: [{ courseId: null }, { courseId: { in: [...enrolledCourseIds] } }] },
        orderBy: { lastActivityAt: "desc" },
        take: 4,
        include: {
          author: { select: { name: true } },
          _count: { select: { posts: true } },
        },
      }),

      prisma.course.findMany({
        where: { published: true, id: { notIn: [...enrolledCourseIds] } },
        orderBy: [{ featured: "desc" }, { priceCents: "asc" }],
        take: 2,
        select: {
          slug: true,
          title: true,
          subtitle: true,
          category: true,
          priceCents: true,
          currency: true,
        },
      }),
    ]);

  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-ink-900">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-2 text-ink-500">
            {active.length
              ? `${active.length} course${active.length === 1 ? "" : "s"} in progress · ${certificates} certificate${certificates === 1 ? "" : "s"} earned`
              : "Nothing in progress. Pick something from the catalog."}
          </p>
        </div>
        <ButtonLink href="/courses" variant="secondary">
          Browse courses
        </ButtonLink>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          {/* ------------------------------------------- continue learning */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink-900">
              Continue learning
            </h2>

            {active.length ? (
              <ul className="mt-5 space-y-4">
                {active.map(({ enrollment, progress, nextLesson }) => (
                  <li key={enrollment.id}>
                    <Card className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-[14rem] flex-1">
                          <Badge tone="neutral">{enrollment.course.category}</Badge>
                          <h3 className="mt-3 text-lg font-semibold text-ink-900">
                            <Link
                              href={`/courses/${enrollment.course.slug}`}
                              className="hover:underline"
                            >
                              {enrollment.course.title}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-ink-500">
                            {enrollment.course.subtitle}
                          </p>
                        </div>
                        <p className="text-right text-2xl font-semibold text-ink-900">
                          {progress.percent}%
                        </p>
                      </div>

                      <ProgressBar percent={progress.percent} className="mt-5" />

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-400">
                        <span>
                          {progress.lessonsCompleted}/{progress.lessonsTotal} lessons ·{" "}
                          {progress.quizzesPassed}/{progress.quizzesTotal} quizzes ·{" "}
                          {progress.assignmentsCleared}/{progress.assignmentsTotal}{" "}
                          assignments
                        </span>
                        <span>Last opened {formatRelative(enrollment.lastAccessedAt)}</span>
                      </div>

                      {nextLesson ? (
                        <ButtonLink
                          href={`/courses/${enrollment.course.slug}/learn/${nextLesson.slug}`}
                          className="mt-5"
                          size="sm"
                        >
                          {progress.lessonsCompleted === 0 ? "Start" : "Resume"}:{" "}
                          {nextLesson.title}
                        </ButtonLink>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5">
                <EmptyState
                  title="No courses in progress"
                  description="Orientation is free and takes about an hour — it is where most people start."
                  action={
                    <ButtonLink href="/courses/academy-orientation">
                      Open Academy Orientation
                    </ButtonLink>
                  }
                />
              </div>
            )}
          </section>

          {/* ----------------------------------------------- what is next */}
          {dueAssignments.length || openQuizzes.length ? (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">
                What is waiting for you
              </h2>
              <p className="mt-1.5 text-sm text-ink-400">
                Progress does not move until these are done.
              </p>

              <ul className="mt-5 space-y-2.5">
                {dueAssignments.map((assignment) => (
                  <TaskRow
                    key={assignment.id}
                    icon="✎"
                    tone="ink"
                    href={`/courses/${assignment.course.slug}/assignments/${assignment.id}`}
                    title={assignment.title}
                    meta={`${assignment.course.title} · assignment · ${assignment.points} points`}
                  />
                ))}
                {openQuizzes.map((quiz) => (
                  <TaskRow
                    key={quiz.id}
                    icon="?"
                    tone="gold"
                    href={`/courses/${quiz.course.slug}/quizzes/${quiz.id}`}
                    title={quiz.title}
                    meta={`${quiz.course.title} · quiz · pass mark ${quiz.passMark}%`}
                  />
                ))}
              </ul>
            </section>
          ) : null}

          {/* --------------------------------------------------- finished */}
          {completed.length ? (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">
                Finished
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {completed.map(({ enrollment }) => (
                  <li key={enrollment.id}>
                    <Card className="flex items-center gap-4 p-5">
                      <span aria-hidden className="text-2xl">
                        🎓
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/courses/${enrollment.course.slug}`}
                          className="font-medium text-ink-900 hover:underline"
                        >
                          {enrollment.course.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-400">
                          Completed {formatRelative(enrollment.completedAt ?? new Date())}
                        </p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
              <Link
                href="/certificates"
                className="mt-4 inline-block text-sm font-medium text-ink-600 underline underline-offset-4 hover:text-ink-900"
              >
                View your certificates →
              </Link>
            </section>
          ) : null}
        </div>

        {/* ------------------------------------------------------- sidebar */}
        <aside className="space-y-8">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-ink-900">From the community</h2>
            {threads.length ? (
              <ul className="mt-4 space-y-4">
                {threads.map((thread) => (
                  <li key={thread.id} className="border-b border-sand-200 pb-4 last:border-0 last:pb-0">
                    <Badge tone="neutral">
                      {THREAD_CATEGORY_LABELS[thread.category as ThreadCategory] ??
                        thread.category}
                    </Badge>
                    <Link
                      href={`/community/${thread.id}`}
                      className="mt-2 block text-sm font-medium leading-snug text-ink-900 hover:underline"
                    >
                      {thread.title}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-ink-400">
                      {excerpt(thread.body, 90)}
                    </p>
                    <p className="mt-1.5 text-[11px] text-ink-400">
                      {thread.author.name} · {thread._count.posts} replies ·{" "}
                      {formatRelative(thread.lastActivityAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-400">No threads yet.</p>
            )}
            <Link
              href="/community"
              className="mt-5 inline-block text-sm font-medium text-ink-600 underline underline-offset-4 hover:text-ink-900"
            >
              Open the community →
            </Link>
          </Card>

          {recommended.length ? (
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-ink-900">Where people go next</h2>
              <ul className="mt-4 space-y-4">
                {recommended.map((course) => (
                  <li key={course.slug}>
                    <Badge tone="neutral">{course.category}</Badge>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="mt-2 block font-medium leading-snug text-ink-900 hover:underline"
                    >
                      {course.title}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      {course.subtitle}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-ink-900">
                      {formatPrice(course.priceCents, course.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function TaskRow({
  icon,
  tone,
  href,
  title,
  meta,
}: {
  icon: string;
  tone: "ink" | "gold";
  href: string;
  title: string;
  meta: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3.5 rounded-xl bg-white px-4 py-3 ring-1 ring-inset ring-sand-200 transition-colors hover:ring-ink-300"
      >
        <span
          aria-hidden
          className={cx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
            tone === "gold" ? "bg-gold-100 text-gold-700" : "bg-ink-100 text-ink-600",
          )}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-ink-900">{title}</span>
          <span className="block truncate text-xs text-ink-400">{meta}</span>
        </span>
        <span aria-hidden className="text-ink-300">
          →
        </span>
      </Link>
    </li>
  );
}
