"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { canAccessCourse, requireCourseAccess, touchEnrollment } from "@/lib/access";
import { recomputeEnrollment } from "@/lib/progress";
import { gradeQuiz, type QuizAnswers } from "@/lib/quiz";

export type ActionState = { error?: string; success?: string };

// ---------------------------------------------------------------------------
// Enrolment
// ---------------------------------------------------------------------------

/**
 * Enrols in a free course. Paid courses go through checkout instead — this
 * action refuses them rather than trusting a price posted from the browser.
 */
export async function enrollFreeAction(_prev: ActionState, formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, priceCents: true, published: true },
  });

  if (!course || !course.published) return { error: "That course is not available." };
  if (course.priceCents > 0) {
    return { error: "This course requires payment. Use the checkout instead." };
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    create: { userId: user.id, courseId: course.id },
    update: { status: "ACTIVE", lastAccessedAt: new Date() },
  });

  redirect(`/courses/${slug}`);
}

// ---------------------------------------------------------------------------
// Lesson progress
// ---------------------------------------------------------------------------

export async function setLessonCompleteAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const lessonId = String(formData.get("lessonId") ?? "");
  const complete = formData.get("complete") === "true";
  const nextHref = String(formData.get("next") ?? "");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, module: { select: { courseId: true, course: { select: { slug: true } } } } },
  });
  if (!lesson) return;

  const courseId = lesson.module.courseId;
  await requireCourseAccess(user, courseId);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
    select: { id: true },
  });
  // Staff can read lessons without enrolling; there is nothing to record.
  if (!enrollment) return;

  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id },
    },
    create: {
      enrollmentId: enrollment.id,
      lessonId: lesson.id,
      completedAt: complete ? new Date() : null,
    },
    update: { completedAt: complete ? new Date() : null },
  });

  await recomputeEnrollment(user.id, courseId);
  revalidatePath(`/courses/${lesson.module.course.slug}`, "layout");
  revalidatePath("/dashboard");

  if (nextHref.startsWith("/")) redirect(nextHref);
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

export async function submitQuizAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const quizId = String(formData.get("quizId") ?? "");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      course: { select: { id: true, slug: true } },
      questions: {
        orderBy: { position: "asc" },
        include: { choices: { select: { id: true, isCorrect: true } } },
      },
    },
  });
  if (!quiz) throw new Error("Quiz not found");

  await requireCourseAccess(user, quiz.course.id);

  const usedAttempts = await prisma.quizAttempt.count({
    where: { quizId, userId: user.id, submittedAt: { not: null } },
  });
  if (usedAttempts >= quiz.maxAttempts) {
    redirect(`/courses/${quiz.course.slug}/quizzes/${quiz.id}?error=attempts`);
  }

  // Answers arrive as q_<questionId> fields; radios send one value, checkbox
  // groups send several under the same name.
  const answers: QuizAnswers = {};
  for (const question of quiz.questions) {
    const values = formData
      .getAll(`q_${question.id}`)
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    if (values.length) answers[question.id] = values;
  }

  const graded = gradeQuiz(
    quiz.questions.map((q) => ({ id: q.id, points: q.points, choices: q.choices })),
    answers,
  );

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      userId: user.id,
      answersJson: JSON.stringify(answers),
      scorePercent: graded.scorePercent,
      passed: graded.scorePercent >= quiz.passMark,
      submittedAt: new Date(),
    },
  });

  await recomputeEnrollment(user.id, quiz.course.id);
  revalidatePath(`/courses/${quiz.course.slug}`, "layout");
  revalidatePath("/dashboard");

  redirect(`/courses/${quiz.course.slug}/quizzes/${quiz.id}?attempt=${attempt.id}`);
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

const submissionSchema = z.object({
  contentMd: z
    .string()
    .trim()
    .min(80, "Give this a proper answer — at least a few sentences.")
    .max(20000),
  linkUrl: z
    .string()
    .trim()
    .url("That does not look like a valid link.")
    .optional()
    .or(z.literal("")),
});

export async function submitAssignmentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const assignmentId = String(formData.get("assignmentId") ?? "");

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { id: true, course: { select: { id: true, slug: true } } },
  });
  if (!assignment) return { error: "That assignment no longer exists." };

  if (!(await canAccessCourse(user, assignment.course.id))) {
    return { error: "You need to enrol in this course first." };
  }

  const parsed = submissionSchema.safeParse({
    contentMd: formData.get("contentMd"),
    linkUrl: formData.get("linkUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your submission." };
  }

  await prisma.assignmentSubmission.upsert({
    where: { assignmentId_userId: { assignmentId, userId: user.id } },
    create: {
      assignmentId,
      userId: user.id,
      contentMd: parsed.data.contentMd,
      linkUrl: parsed.data.linkUrl || null,
      status: "SUBMITTED",
    },
    // Resubmitting clears the previous grade — the work being marked changed.
    update: {
      contentMd: parsed.data.contentMd,
      linkUrl: parsed.data.linkUrl || null,
      status: "SUBMITTED",
      grade: null,
      feedback: null,
      gradedAt: null,
      gradedById: null,
      submittedAt: new Date(),
    },
  });

  await recomputeEnrollment(user.id, assignment.course.id);
  await touchEnrollment(user.id, assignment.course.id);
  revalidatePath(`/courses/${assignment.course.slug}`, "layout");
  revalidatePath("/dashboard");

  return { success: "Submitted. You will see feedback here once it has been marked." };
}
