import "server-only";

import { prisma } from "./prisma";
import type { SessionUser } from "./session";

/**
 * One place that answers "is this person allowed to see paid course
 * material?". Pages, server actions and the download route all go through
 * here so the rules cannot drift apart.
 */

export function isStaff(user: { role: string } | null | undefined): boolean {
  return user?.role === "ADMIN" || user?.role === "INSTRUCTOR";
}

export async function getEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

/**
 * Staff can always see course material. Learners need an enrolment that has
 * not been cancelled.
 */
export async function canAccessCourse(
  user: SessionUser | null,
  courseId: string,
): Promise<boolean> {
  if (!user) return false;
  if (isStaff(user)) return true;

  const enrollment = await getEnrollment(user.id, courseId);
  return Boolean(enrollment) && enrollment!.status !== "CANCELLED";
}

export async function requireCourseAccess(
  user: SessionUser | null,
  courseId: string,
): Promise<void> {
  if (!(await canAccessCourse(user, courseId))) {
    throw new Error("You need to enrol in this course first.");
  }
}

/** Touches the enrolment so "continue where you left off" stays accurate. */
export async function touchEnrollment(userId: string, courseId: string): Promise<void> {
  await prisma.enrollment.updateMany({
    where: { userId, courseId },
    data: { lastAccessedAt: new Date() },
  });
}
