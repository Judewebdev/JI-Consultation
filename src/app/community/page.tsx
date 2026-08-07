import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaff } from "@/lib/access";
import { formatRelative } from "@/lib/format";
import { THREAD_CATEGORY_LABELS, type ThreadCategory } from "@/lib/enums";
import { excerpt } from "@/lib/markdown";
import { Avatar, Badge, Card, EmptyState } from "@/components/ui";
import { NewThreadForm } from "@/components/community-forms";

export const metadata: Metadata = { title: "Community" };

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/community");

  const { course: courseFilter } = await searchParams;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id, status: { not: "CANCELLED" } },
    select: { course: { select: { id: true, slug: true, title: true } } },
  });

  const myCourses = enrollments.map((e) => e.course);
  const myCourseIds = myCourses.map((c) => c.id);

  // Staff see every course space; learners see the academy-wide space plus
  // the courses they are actually on.
  const visibility = isStaff(user)
    ? {}
    : { OR: [{ courseId: null }, { courseId: { in: myCourseIds } }] };

  const selected = courseFilter
    ? await prisma.course.findUnique({
        where: { slug: courseFilter },
        select: { id: true, title: true, slug: true },
      })
    : null;

  const threads = await prisma.communityThread.findMany({
    where: {
      ...visibility,
      ...(selected ? { courseId: selected.id } : {}),
    },
    orderBy: [{ pinned: "desc" }, { lastActivityAt: "desc" }],
    include: {
      author: { select: { name: true, headline: true } },
      course: { select: { slug: true, title: true } },
      _count: { select: { posts: true } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
          Community
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-900">
          {selected ? selected.title : "Discussion"}
        </h1>
        <p className="mt-4 text-lg text-ink-500">
          Specific questions with real numbers get real answers. Share the work you are
          unsure about — feedback on a rough draft beats applause for a polished one.
        </p>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filter by course">
        <Chip href="/community" active={!selected}>
          All
        </Chip>
        {myCourses.map((course) => (
          <Chip
            key={course.id}
            href={`/community?course=${course.slug}`}
            active={selected?.id === course.id}
          >
            {course.title}
          </Chip>
        ))}
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div>
          {threads.length ? (
            <ul className="space-y-3">
              {threads.map((thread) => (
                <li key={thread.id}>
                  <Card className="p-5 transition-shadow hover:shadow-md">
                    <div className="flex gap-4">
                      <Avatar name={thread.author.name} size={40} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {thread.pinned ? <Badge tone="gold">Pinned</Badge> : null}
                          <Badge tone="neutral">
                            {THREAD_CATEGORY_LABELS[thread.category as ThreadCategory] ??
                              thread.category}
                          </Badge>
                          {thread.course ? (
                            <Badge tone="neutral">{thread.course.title}</Badge>
                          ) : null}
                          {thread.locked ? <Badge tone="red">Closed</Badge> : null}
                        </div>

                        <h2 className="mt-2.5 text-lg font-semibold leading-snug text-ink-900">
                          <Link href={`/community/${thread.id}`} className="hover:underline">
                            {thread.title}
                          </Link>
                        </h2>

                        <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                          {excerpt(thread.body, 190)}
                        </p>

                        <p className="mt-3 text-xs text-ink-400">
                          <span className="font-medium text-ink-600">
                            {thread.author.name}
                          </span>
                          {thread.author.headline ? ` · ${thread.author.headline}` : ""} ·{" "}
                          {thread._count.posts}{" "}
                          {thread._count.posts === 1 ? "reply" : "replies"} · active{" "}
                          {formatRelative(thread.lastActivityAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Nothing here yet"
              description="Be the first to post. A specific question with real numbers gets answered faster than you expect."
            />
          )}
        </div>

        <aside className="space-y-6">
          <NewThreadForm courses={myCourses} />

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-ink-900">How to get answers</h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
              <li>
                <span className="font-medium text-ink-900">1. Context.</span> What kind of
                business, what size, what market.
              </li>
              <li>
                <span className="font-medium text-ink-900">2. What you tried.</span> The
                actual thing you did, with numbers.
              </li>
              <li>
                <span className="font-medium text-ink-900">3. What happened.</span> The
                result, not your interpretation of it.
              </li>
              <li>
                <span className="font-medium text-ink-900">4. One question.</span> If there
                are two, post two threads.
              </li>
            </ol>
            <p className="mt-5 border-t border-sand-200 pt-4 text-xs leading-relaxed text-ink-400">
              One rule: no pitching. If someone asks for a recommendation and you sell
              that thing, say so in the same sentence.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-ink-900 px-4 py-1.5 text-sm font-medium text-white"
          : "rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink-600 ring-1 ring-inset ring-sand-200 hover:bg-sand-100"
      }
    >
      {children}
    </Link>
  );
}
