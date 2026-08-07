"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { canAccessCourse } from "@/lib/access";
import { THREAD_CATEGORIES } from "@/lib/enums";

export type CommunityState = { error?: string };

const threadSchema = z.object({
  title: z.string().trim().min(12, "Give the thread a title people can scan.").max(140),
  body: z
    .string()
    .trim()
    .min(40, "Add some context — vague questions do not get answered.")
    .max(10000),
  category: z.enum(THREAD_CATEGORIES),
  courseId: z.string().trim().optional().or(z.literal("")),
});

export async function createThreadAction(
  _prev: CommunityState,
  formData: FormData,
): Promise<CommunityState> {
  const user = await requireUser();

  const parsed = threadSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    category: formData.get("category"),
    courseId: formData.get("courseId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  // A course-scoped thread is only visible to people on that course, so you
  // have to be on it yourself to open one.
  const courseId = parsed.data.courseId || null;
  if (courseId && !(await canAccessCourse(user, courseId))) {
    return { error: "You can only post in courses you are enrolled in." };
  }

  const thread = await prisma.communityThread.create({
    data: {
      authorId: user.id,
      courseId,
      title: parsed.data.title,
      body: parsed.data.body,
      category: parsed.data.category,
    },
  });

  revalidatePath("/community");
  redirect(`/community/${thread.id}`);
}

const replySchema = z.object({
  threadId: z.string().min(1),
  body: z.string().trim().min(2, "Write a reply first.").max(10000),
});

export async function createReplyAction(
  _prev: CommunityState,
  formData: FormData,
): Promise<CommunityState> {
  const user = await requireUser();

  const parsed = replySchema.safeParse({
    threadId: formData.get("threadId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your reply." };
  }

  const thread = await prisma.communityThread.findUnique({
    where: { id: parsed.data.threadId },
    select: { id: true, locked: true, courseId: true },
  });
  if (!thread) return { error: "That thread no longer exists." };
  if (thread.locked) return { error: "This thread is closed to new replies." };

  if (thread.courseId && !(await canAccessCourse(user, thread.courseId))) {
    return { error: "You need to be enrolled in this course to reply." };
  }

  await prisma.$transaction([
    prisma.communityPost.create({
      data: { threadId: thread.id, authorId: user.id, body: parsed.data.body },
    }),
    prisma.communityThread.update({
      where: { id: thread.id },
      data: { lastActivityAt: new Date() },
    }),
  ]);

  revalidatePath(`/community/${thread.id}`);
  revalidatePath("/community");
  return {};
}
