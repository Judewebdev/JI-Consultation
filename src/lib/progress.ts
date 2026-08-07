import { randomBytes } from "node:crypto";

import { prisma } from "./prisma";

/**
 * Course completion model
 * -----------------------
 * A course is made of three kinds of completable item: lessons, quizzes and
 * assignments. Progress is the share of those items a learner has finished,
 * so the number on the dashboard always matches something the learner can
 * point at. A course is complete when every item is done:
 *
 *   lesson      → marked complete by the learner
 *   quiz        → best attempt scored at or above the quiz pass mark
 *   assignment  → submitted (and, once graded, not sent back for rework)
 *
 * Assignments only count when Course.requireAssignments is set.
 */

export type CourseProgress = {
  lessonsTotal: number;
  lessonsCompleted: number;
  completedLessonIds: Set<string>;
  quizzesTotal: number;
  quizzesPassed: number;
  /** quizId → best score percent across submitted attempts. */
  bestQuizScores: Map<string, number>;
  assignmentsTotal: number;
  assignmentsCleared: number;
  assignmentsRequired: boolean;
  itemsTotal: number;
  itemsDone: number;
  percent: number;
  isComplete: boolean;
  /** Mean of best quiz scores, used as the score printed on the certificate. */
  finalScore: number;
};

const EMPTY_PROGRESS: CourseProgress = {
  lessonsTotal: 0,
  lessonsCompleted: 0,
  completedLessonIds: new Set(),
  quizzesTotal: 0,
  quizzesPassed: 0,
  bestQuizScores: new Map(),
  assignmentsTotal: 0,
  assignmentsCleared: 0,
  assignmentsRequired: false,
  itemsTotal: 0,
  itemsDone: 0,
  percent: 0,
  isComplete: false,
  finalScore: 0,
};

export async function getCourseProgress(
  userId: string,
  courseId: string,
): Promise<CourseProgress> {
  const [course, enrollment] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      select: {
        requireAssignments: true,
        modules: { select: { lessons: { select: { id: true } } } },
        quizzes: { select: { id: true, passMark: true } },
        assignments: { select: { id: true } },
      },
    }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: {
        id: true,
        lessonProgress: {
          where: { completedAt: { not: null } },
          select: { lessonId: true },
        },
      },
    }),
  ]);

  if (!course) return EMPTY_PROGRESS;

  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const completedLessonIds = new Set(
    (enrollment?.lessonProgress ?? [])
      .map((p) => p.lessonId)
      .filter((id) => lessonIds.includes(id)),
  );

  // Best submitted attempt per quiz.
  const quizIds = course.quizzes.map((q) => q.id);
  const attempts = quizIds.length
    ? await prisma.quizAttempt.findMany({
        where: { userId, quizId: { in: quizIds }, submittedAt: { not: null } },
        select: { quizId: true, scorePercent: true },
      })
    : [];

  const bestQuizScores = new Map<string, number>();
  for (const attempt of attempts) {
    const current = bestQuizScores.get(attempt.quizId) ?? 0;
    if (attempt.scorePercent > current) bestQuizScores.set(attempt.quizId, attempt.scorePercent);
  }
  const quizzesPassed = course.quizzes.filter(
    (q) => (bestQuizScores.get(q.id) ?? -1) >= q.passMark,
  ).length;

  // Assignments: submitted and not returned for rework.
  const assignmentIds = course.assignments.map((a) => a.id);
  const submissions = assignmentIds.length
    ? await prisma.assignmentSubmission.findMany({
        where: { userId, assignmentId: { in: assignmentIds } },
        select: { assignmentId: true, status: true },
      })
    : [];
  const assignmentsCleared = submissions.filter((s) => s.status !== "RETURNED").length;

  const assignmentsRequired = course.requireAssignments && assignmentIds.length > 0;

  const itemsTotal =
    lessonIds.length + course.quizzes.length + (assignmentsRequired ? assignmentIds.length : 0);
  const itemsDone =
    completedLessonIds.size + quizzesPassed + (assignmentsRequired ? assignmentsCleared : 0);

  const percent = itemsTotal === 0 ? 0 : Math.round((itemsDone / itemsTotal) * 100);

  const scores = [...bestQuizScores.values()];
  const finalScore = scores.length
    ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
    : 100; // a course with no quizzes is graded on completion alone

  return {
    lessonsTotal: lessonIds.length,
    lessonsCompleted: completedLessonIds.size,
    completedLessonIds,
    quizzesTotal: course.quizzes.length,
    quizzesPassed,
    bestQuizScores,
    assignmentsTotal: assignmentIds.length,
    assignmentsCleared,
    assignmentsRequired,
    itemsTotal,
    itemsDone,
    percent,
    isComplete: itemsTotal > 0 && itemsDone >= itemsTotal,
    finalScore,
  };
}

/**
 * Recomputes progress, writes it to the enrolment, and issues the certificate
 * the moment the course is finished. Call this after any action that could
 * change completion: lesson ticked, quiz submitted, assignment handed in.
 */
export async function recomputeEnrollment(userId: string, courseId: string) {
  const progress = await getCourseProgress(userId, courseId);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true, status: true },
  });
  if (!enrollment) return { progress, certificate: null };

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPercent: progress.percent,
      status: progress.isComplete ? "COMPLETED" : "ACTIVE",
      completedAt: progress.isComplete ? new Date() : null,
      lastAccessedAt: new Date(),
    },
  });

  const certificate = progress.isComplete
    ? await issueCertificate(userId, courseId, progress.finalScore)
    : null;

  return { progress, certificate };
}

/** Idempotent: re-running on an already-certified course returns the original. */
export async function issueCertificate(userId: string, courseId: string, finalScore: number) {
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, certificateEnabled: true },
    }),
  ]);
  if (!user || !course || !course.certificateEnabled) return null;

  return prisma.certificate.create({
    data: {
      serial: generateSerial(),
      userId,
      courseId,
      recipientName: user.name,
      courseTitle: course.title,
      finalScore,
    },
  });
}

/**
 * Public certificate id, e.g. JIGA-2026-7QK3F2. Ambiguous characters (I, O,
 * 0, 1) are excluded so serials survive being read aloud or copied by hand.
 */
export function generateSerial(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let body = "";
  for (const byte of bytes) body += alphabet[byte % alphabet.length];
  return `JIGA-${new Date().getFullYear()}-${body}`;
}
