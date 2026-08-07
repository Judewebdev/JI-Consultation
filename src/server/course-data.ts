import "server-only";

import { prisma } from "@/lib/prisma";
import { getCourseProgress, type CourseProgress } from "@/lib/progress";
import type { SessionUser } from "@/lib/session";
import { canAccessCourse } from "@/lib/access";

/**
 * One loader for the course page, the lesson player and the quiz/assignment
 * screens. They all need the same shape — the whole curriculum plus the
 * viewer's position in it — and loading it once here keeps the "is this
 * lesson done?" logic from being reimplemented three times.
 */

export async function loadCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true, headline: true, bio: true } },
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: {
              resources: { orderBy: { position: "asc" } },
            },
          },
          quizzes: { select: { id: true, title: true, passMark: true, maxAttempts: true } },
          assignments: { select: { id: true, title: true, points: true } },
        },
      },
      quizzes: {
        where: { isFinal: true },
        select: {
          id: true,
          title: true,
          description: true,
          passMark: true,
          maxAttempts: true,
          timeLimitMinutes: true,
          _count: { select: { questions: true } },
        },
      },
      assignments: {
        where: { moduleId: null },
        select: { id: true, title: true, briefMd: true, points: true, dueInDays: true },
      },
      resources: {
        where: { lessonId: null },
        orderBy: { position: "asc" },
      },
      _count: { select: { enrollments: true } },
    },
  });
}

export type LoadedCourse = NonNullable<Awaited<ReturnType<typeof loadCourse>>>;

export type CourseViewer = {
  user: SessionUser | null;
  hasAccess: boolean;
  enrollment: { id: string; progressPercent: number; status: string } | null;
  progress: CourseProgress | null;
  /** Best submitted score per quiz id. */
  quizScores: Map<string, number>;
  /** assignmentId → the viewer's submission status. */
  submissions: Map<string, { status: string; grade: number | null }>;
};

export async function loadViewer(
  user: SessionUser | null,
  courseId: string,
): Promise<CourseViewer> {
  if (!user) {
    return {
      user: null,
      hasAccess: false,
      enrollment: null,
      progress: null,
      quizScores: new Map(),
      submissions: new Map(),
    };
  }

  const [hasAccess, enrollment] = await Promise.all([
    canAccessCourse(user, courseId),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { id: true, progressPercent: true, status: true },
    }),
  ]);

  if (!enrollment) {
    return {
      user,
      hasAccess,
      enrollment: null,
      progress: null,
      quizScores: new Map(),
      submissions: new Map(),
    };
  }

  const progress = await getCourseProgress(user.id, courseId);

  const submissionRows = await prisma.assignmentSubmission.findMany({
    where: { userId: user.id, assignment: { courseId } },
    select: { assignmentId: true, status: true, grade: true },
  });

  return {
    user,
    hasAccess,
    enrollment,
    progress,
    quizScores: progress.bestQuizScores,
    submissions: new Map(
      submissionRows.map((s) => [s.assignmentId, { status: s.status, grade: s.grade }]),
    ),
  };
}

/** Flat lesson order, for "next lesson" navigation. */
export function flattenLessons(course: LoadedCourse) {
  return course.modules.flatMap((m) =>
    m.lessons.map((lesson) => ({ ...lesson, moduleTitle: m.title, moduleId: m.id })),
  );
}
