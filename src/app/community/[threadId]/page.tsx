import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { canAccessCourse } from "@/lib/access";
import { formatRelative } from "@/lib/format";
import { THREAD_CATEGORY_LABELS, type ThreadCategory } from "@/lib/enums";
import { renderMarkdown, excerpt } from "@/lib/markdown";
import { Alert, Avatar, Badge, Card } from "@/components/ui";
import { ReplyForm } from "@/components/community-forms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ threadId: string }>;
}): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await prisma.communityThread.findUnique({
    where: { id: threadId },
    select: { title: true, body: true },
  });
  return thread
    ? { title: thread.title, description: excerpt(thread.body, 150) }
    : { title: "Thread not found" };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/community/${threadId}`);

  const thread = await prisma.communityThread.findUnique({
    where: { id: threadId },
    include: {
      author: { select: { name: true, headline: true, country: true } },
      course: { select: { id: true, slug: true, title: true } },
      posts: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, headline: true } } },
      },
    },
  });
  if (!thread) notFound();

  // Course-scoped threads are part of the course. Enrolment gates them the
  // same way it gates the lessons.
  if (thread.courseId && !(await canAccessCourse(user, thread.courseId))) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <span aria-hidden className="text-4xl">
          🔒
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900">
          This discussion is part of {thread.course?.title}
        </h1>
        <p className="mt-4 text-ink-500">
          Enrol in the course to read and take part in its community space.
        </p>
        <Link
          href={thread.course ? `/courses/${thread.course.slug}` : "/courses"}
          className="mt-6 inline-block font-medium text-ink-800 underline underline-offset-4"
        >
          View the course
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-ink-400">
        <Link href="/community" className="hover:text-ink-700">
          Community
        </Link>
        {thread.course ? (
          <>
            <span aria-hidden className="mx-2">
              /
            </span>
            <Link
              href={`/community?course=${thread.course.slug}`}
              className="hover:text-ink-700"
            >
              {thread.course.title}
            </Link>
          </>
        ) : null}
      </nav>

      <article className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {thread.pinned ? <Badge tone="gold">Pinned</Badge> : null}
          <Badge tone="neutral">
            {THREAD_CATEGORY_LABELS[thread.category as ThreadCategory] ?? thread.category}
          </Badge>
          {thread.locked ? <Badge tone="red">Closed</Badge> : null}
        </div>

        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-900">
          {thread.title}
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <Avatar name={thread.author.name} size={40} />
          <div className="text-sm">
            <p className="font-medium text-ink-900">{thread.author.name}</p>
            <p className="text-ink-400">
              {[thread.author.headline, thread.author.country].filter(Boolean).join(" · ")}
              {thread.author.headline || thread.author.country ? " · " : ""}
              {formatRelative(thread.createdAt)}
            </p>
          </div>
        </div>

        <div
          className="prose-lesson mt-7"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(thread.body) }}
        />
      </article>

      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          {thread.posts.length} {thread.posts.length === 1 ? "reply" : "replies"}
        </h2>

        <ul className="mt-6 space-y-4">
          {thread.posts.map((post) => (
            <li key={post.id}>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar name={post.author.name} size={34} />
                  <div className="min-w-0 text-sm">
                    <p className="font-medium text-ink-900">{post.author.name}</p>
                    <p className="truncate text-xs text-ink-400">
                      {post.author.headline
                        ? `${post.author.headline} · `
                        : ""}
                      {formatRelative(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div
                  className="prose-lesson prose-compact mt-4"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
                />
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-sand-200 pt-8">
        {thread.locked ? (
          <Alert tone="neutral" title="This thread is closed">
            No new replies can be added. Start a new thread if you have a follow-up.
          </Alert>
        ) : (
          <>
            <h2 className="text-lg font-semibold tracking-tight text-ink-900">
              Add your reply
            </h2>
            <div className="mt-5">
              <ReplyForm threadId={thread.id} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
