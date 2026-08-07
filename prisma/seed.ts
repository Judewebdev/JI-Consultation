/**
 * Seeds a complete, believable academy: four courses with generated download
 * packs, a staff account, five learners at different stages, real quiz
 * attempts, graded assignments, issued certificates, paid and pending orders,
 * and a community with conversations in it.
 *
 * Safe to re-run — it clears the tables it owns first.
 *
 *   npm run db:seed
 */

import bcrypt from "bcryptjs";

// The shared client, not a second one: progress.ts writes through it, and two
// PrismaClients against the same SQLite file will deadlock each other.
import { prisma } from "../src/lib/prisma";
import { gradeQuiz, type QuizAnswers } from "../src/lib/quiz";
import { recomputeEnrollment } from "../src/lib/progress";
import { buildLessonResources, buildCourseResource } from "./content/resource-builder";
import { courseSpecs } from "./content/courses";
import { communitySeeds } from "./content/community";
import type { CourseSpec, QuizSpec } from "./content/types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const ago = (ms: number) => new Date(Date.now() - ms);

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@jiglobalacademy.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Academy!2345";
const STUDENT_EMAIL = process.env.SEED_STUDENT_EMAIL ?? "student@example.com";
const STUDENT_PASSWORD = process.env.SEED_STUDENT_PASSWORD ?? "Student!2345";

/**
 * Index order matters: prisma/content/community.ts refers to these people by
 * position.
 */
const people = [
  {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: "Nathan Okonkwo",
    role: "ADMIN",
    headline: "Lead instructor, JI Consultation",
    country: "United Kingdom",
    bio: "Fifteen years advising owner-operators. Writes the courses, answers the awkward questions.",
  },
  {
    email: "daniel.fenwick@example.com",
    password: "Learner!2345",
    name: "Daniel Fenwick",
    role: "STUDENT",
    headline: "Independent systems & process consultant",
    country: "United Kingdom",
    bio: "Six years independent. Trying to stop selling days.",
  },
  {
    email: STUDENT_EMAIL,
    password: STUDENT_PASSWORD,
    name: "Ama Serwaa",
    role: "STUDENT",
    headline: "Operations consultant, food manufacturing",
    country: "Ghana",
    bio: "Nine clients last year, seven of them from two introductions. Working on that.",
  },
  {
    email: "tunde.bakare@example.com",
    password: "Learner!2345",
    name: "Tunde Bakare",
    role: "STUDENT",
    headline: "Agency owner, 8 people, logistics clients",
    country: "Nigeria",
    bio: "Drowning in coordination overhead. Here for the operations course.",
  },
  {
    email: "priya.raman@example.com",
    password: "Learner!2345",
    name: "Priya Raman",
    role: "STUDENT",
    headline: "Supply chain consultant, UK & UAE",
    country: "United Arab Emirates",
    bio: "55% of revenue from one client. Fixing the concentration problem.",
  },
  {
    email: "adaeze.nwosu@jiglobalacademy.com",
    password: "Instructor!2345",
    name: "Dr. Adaeze Nwosu",
    role: "INSTRUCTOR",
    headline: "Faculty — practice economics and client acquisition",
    country: "Nigeria",
    bio: "Built and sold two consultancies. Teaches the pricing and acquisition tracks.",
  },
] as const;

// ---------------------------------------------------------------------------
// Reset
// ---------------------------------------------------------------------------

async function reset() {
  // Order matters: children before parents. Cascades would handle most of it,
  // but being explicit keeps the seed readable and provider-independent.
  await prisma.resourceDownload.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.communityThread.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.order.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

async function createQuiz(
  spec: QuizSpec,
  courseId: string,
  moduleId: string | null,
  isFinal: boolean,
) {
  const quiz = await prisma.quiz.create({
    data: {
      courseId,
      moduleId,
      title: spec.title,
      description: spec.description ?? null,
      passMark: spec.passMark ?? 70,
      timeLimitMinutes: spec.timeLimitMinutes ?? null,
      maxAttempts: spec.maxAttempts ?? 3,
      isFinal,
    },
  });

  for (const [index, questionSpec] of spec.questions.entries()) {
    await prisma.question.create({
      data: {
        quizId: quiz.id,
        prompt: questionSpec.prompt,
        type: questionSpec.type ?? "SINGLE",
        explanation: questionSpec.explanation ?? null,
        points: questionSpec.points ?? 1,
        position: index,
        choices: {
          create: questionSpec.choices.map((raw, choiceIndex) => ({
            // A leading "*" in the authoring format marks the correct answer.
            text: raw.startsWith("*") ? raw.slice(1) : raw,
            isCorrect: raw.startsWith("*"),
            position: choiceIndex,
          })),
        },
      },
    });
  }

  return quiz;
}

async function createCourse(spec: CourseSpec, instructorId: string) {
  const course = await prisma.course.create({
    data: {
      slug: spec.slug,
      title: spec.title,
      subtitle: spec.subtitle,
      description: spec.description,
      category: spec.category,
      level: spec.level,
      welcomeVideoUrl: spec.welcomeVideoUrl ?? null,
      welcomeVideoNote: spec.welcomeVideoNote,
      priceCents: spec.priceCents,
      currency: process.env.PAYMENTS_CURRENCY ?? "USD",
      estimatedHours: spec.estimatedHours,
      published: true,
      featured: spec.featured ?? false,
      outcomesJson: JSON.stringify(spec.outcomes),
      requirementsJson: JSON.stringify(spec.requirements),
      passMark: spec.passMark ?? 70,
      instructorId,
    },
  });

  let assignmentPosition = 0;

  for (const [moduleIndex, moduleSpec] of spec.modules.entries()) {
    const courseModule = await prisma.module.create({
      data: {
        courseId: course.id,
        title: moduleSpec.title,
        summary: moduleSpec.summary,
        position: moduleIndex,
      },
    });

    for (const [lessonIndex, lessonSpec] of moduleSpec.lessons.entries()) {
      const lesson = await prisma.lesson.create({
        data: {
          moduleId: courseModule.id,
          slug: lessonSpec.slug,
          title: lessonSpec.title,
          summary: lessonSpec.summary,
          contentMd: lessonSpec.body,
          videoUrl: lessonSpec.videoUrl ?? null,
          durationMinutes: lessonSpec.durationMinutes,
          position: lessonIndex,
          isPreview: lessonSpec.isPreview ?? false,
        },
      });

      const resources = await buildLessonResources(spec.slug, spec.title, lessonSpec);
      for (const resource of resources) {
        await prisma.resource.create({
          data: { ...resource, courseId: course.id, lessonId: lesson.id },
        });
      }
    }

    if (moduleSpec.quiz) {
      await createQuiz(moduleSpec.quiz, course.id, courseModule.id, false);
    }

    if (moduleSpec.assignment) {
      await prisma.assignment.create({
        data: {
          courseId: course.id,
          moduleId: courseModule.id,
          title: moduleSpec.assignment.title,
          briefMd: moduleSpec.assignment.briefMd,
          deliverables: JSON.stringify(moduleSpec.assignment.deliverables),
          points: moduleSpec.assignment.points ?? 100,
          dueInDays: moduleSpec.assignment.dueInDays ?? 14,
          position: assignmentPosition++,
        },
      });
    }
  }

  await createQuiz(spec.finalQuiz, course.id, null, true);

  await prisma.assignment.create({
    data: {
      courseId: course.id,
      title: spec.capstone.title,
      briefMd: spec.capstone.briefMd,
      deliverables: JSON.stringify(spec.capstone.deliverables),
      points: spec.capstone.points ?? 200,
      dueInDays: spec.capstone.dueInDays ?? 21,
      position: assignmentPosition++,
    },
  });

  for (const [index, resourceSpec] of (spec.courseResources ?? []).entries()) {
    const built = await buildCourseResource(spec.slug, spec.title, resourceSpec, index);
    await prisma.resource.create({
      data: { ...built, courseId: course.id, lessonId: null },
    });
  }

  return course;
}

// ---------------------------------------------------------------------------
// Learner activity
// ---------------------------------------------------------------------------

/**
 * Records a quiz attempt by answering `correctRatio` of the questions
 * correctly, then grading it with the same function the app uses — so seeded
 * scores are never inconsistent with how the app would have scored them.
 */
async function attemptQuiz(
  userId: string,
  quizId: string,
  correctRatio: number,
  submittedAt: Date,
) {
  const questions = await prisma.question.findMany({
    where: { quizId },
    orderBy: { position: "asc" },
    include: { choices: { orderBy: { position: "asc" } } },
  });
  if (!questions.length) return null;

  const correctCount = Math.round(questions.length * correctRatio);
  const answers: QuizAnswers = {};

  questions.forEach((question, index) => {
    const correctIds = question.choices.filter((c) => c.isCorrect).map((c) => c.id);
    if (index < correctCount) {
      answers[question.id] = correctIds;
    } else {
      // A plausible wrong answer: pick a single incorrect choice if there is
      // one, otherwise drop one of the correct choices.
      const wrong = question.choices.find((c) => !c.isCorrect);
      answers[question.id] = wrong ? [wrong.id] : correctIds.slice(1);
    }
  });

  const graded = gradeQuiz(
    questions.map((q) => ({
      id: q.id,
      points: q.points,
      choices: q.choices.map((c) => ({ id: c.id, isCorrect: c.isCorrect })),
    })),
    answers,
  );

  const quiz = await prisma.quiz.findUniqueOrThrow({ where: { id: quizId } });

  return prisma.quizAttempt.create({
    data: {
      quizId,
      userId,
      answersJson: JSON.stringify(answers),
      scorePercent: graded.scorePercent,
      passed: graded.scorePercent >= quiz.passMark,
      startedAt: new Date(submittedAt.getTime() - 12 * 60 * 1000),
      submittedAt,
    },
  });
}

type ProgressPlan = {
  /** How far through the course to take this learner, 0–1. */
  through: number;
  /** Whether to answer quizzes well enough to pass. */
  passQuizzes?: boolean;
  /** Submit assignments belonging to completed modules. */
  submitAssignments?: boolean;
  /** Grade the submitted assignments. */
  gradeAssignments?: boolean;
  /** Take (and pass) the final quiz and submit the capstone. */
  finish?: boolean;
  enrolledDaysAgo: number;
};

async function enrolAndProgress(
  userId: string,
  graderId: string,
  courseSlug: string,
  plan: ProgressPlan,
) {
  const course = await prisma.course.findUniqueOrThrow({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
      quizzes: true,
      assignments: { orderBy: { position: "asc" } },
    },
  });

  const enrolledAt = ago(plan.enrolledDaysAgo * DAY);

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId: course.id,
      enrolledAt,
      lastAccessedAt: ago(Math.max(1, plan.enrolledDaysAgo - 2) * DAY),
    },
  });

  if (course.priceCents > 0) {
    await prisma.order.create({
      data: {
        userId,
        courseId: course.id,
        provider: "mock",
        providerRef: `mock_seed_${userId.slice(-6)}_${course.slug}`,
        amountCents: course.priceCents,
        currency: course.currency,
        status: "PAID",
        createdAt: enrolledAt,
        paidAt: enrolledAt,
      },
    });
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lessonTarget = plan.finish
    ? allLessons.length
    : Math.floor(allLessons.length * plan.through);

  for (const [index, lesson] of allLessons.slice(0, lessonTarget).entries()) {
    await prisma.lessonProgress.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        completedAt: new Date(enrolledAt.getTime() + (index + 1) * 8 * HOUR),
        secondsWatched: lesson.durationMinutes * 60,
      },
    });
  }

  // Which modules are fully covered by the lessons completed above?
  let seen = 0;
  const completedModuleIds = new Set<string>();
  for (const courseModule of course.modules) {
    seen += courseModule.lessons.length;
    if (seen <= lessonTarget) completedModuleIds.add(courseModule.id);
  }

  // Module quizzes: one failed first attempt, then a pass, for realism.
  for (const quiz of course.quizzes.filter((q) => !q.isFinal)) {
    if (!quiz.moduleId || !completedModuleIds.has(quiz.moduleId)) continue;

    const base = new Date(enrolledAt.getTime() + 3 * DAY);
    await attemptQuiz(userId, quiz.id, 0.5, base);
    if (plan.passQuizzes !== false) {
      await attemptQuiz(userId, quiz.id, 1, new Date(base.getTime() + 2 * HOUR));
    }
  }

  if (plan.finish) {
    const finalQuiz = course.quizzes.find((q) => q.isFinal);
    if (finalQuiz) {
      // Not a perfect score: the certificate should show a believable mark.
      await attemptQuiz(userId, finalQuiz.id, 0.85, new Date(enrolledAt.getTime() + 9 * DAY));
    }
  }

  // Assignments for completed modules, plus the capstone when finishing.
  if (plan.submitAssignments !== false) {
    for (const assignment of course.assignments) {
      const isCapstone = assignment.moduleId === null;
      const moduleDone = assignment.moduleId
        ? completedModuleIds.has(assignment.moduleId)
        : false;
      if (!moduleDone && !(isCapstone && plan.finish)) continue;

      const submittedAt = new Date(enrolledAt.getTime() + (isCapstone ? 10 : 5) * DAY);
      const graded = plan.gradeAssignments ?? true;

      await prisma.assignmentSubmission.create({
        data: {
          assignmentId: assignment.id,
          userId,
          contentMd: seededSubmission(assignment.title),
          status: graded ? "GRADED" : "SUBMITTED",
          grade: graded ? Math.round(assignment.points * 0.86) : null,
          feedback: graded ? seededFeedback() : null,
          gradedById: graded ? graderId : null,
          submittedAt,
          gradedAt: graded ? new Date(submittedAt.getTime() + 2 * DAY) : null,
        },
      });
    }
  }

  await recomputeEnrollment(userId, course.id);
}

function seededSubmission(title: string): string {
  return `
## ${title}

Submitted against my own practice rather than a worked example, as instructed.

**Where I started.** I went into this assuming the problem was volume — not enough
conversations at the top of the funnel. Doing the exercise properly showed it was
concentration: two introductions accounted for most of last year, and one of those
people has now retired.

**What I did.** Worked through each step with real numbers from the last twelve
months rather than estimates. The step that took longest was quantifying the cost
side, because I had genuinely never asked a client what the problem was costing them.

**What surprised me.** The figure was roughly four times what I had assumed, which
makes my current pricing look considerably less defensible than it did on Monday.

**What changes this week.** Two specific things, both diarised: the positioning
statement goes on the site by Friday, and I have declined one opportunity that would
previously have gone straight to proposal.
  `.trim();
}

function seededFeedback(): string {
  return `
Strong submission — you used real numbers throughout, which is what makes this
exercise worth anything.

Two things to push on. First, your cost-of-problem figure is well evidenced but you
have applied it uniformly across client sizes; the smaller end almost certainly does
not support that number, and pricing them the same way will cost you deals you should
be winning. Second, the "what changes this week" section is genuinely specific on the
positioning statement but vague on the declining — name the criteria, not the
intention, or you will find a reason to make an exception.

Marked as passed. Bring the client-size question to the community; several people
here have solved it differently and the disagreement is instructive.
  `.trim();
}

// ---------------------------------------------------------------------------
// Community
// ---------------------------------------------------------------------------

async function createCommunity(userIds: string[], courseIdBySlug: Map<string, string>) {
  for (const seed of communitySeeds) {
    const createdAt = ago(seed.ageHours * HOUR);
    const lastReply = seed.replies.length
      ? Math.min(...seed.replies.map((r) => r.ageHours))
      : seed.ageHours;

    const thread = await prisma.communityThread.create({
      data: {
        courseId: seed.courseSlug ? (courseIdBySlug.get(seed.courseSlug) ?? null) : null,
        authorId: userIds[seed.author]!,
        title: seed.title,
        body: seed.body,
        category: seed.category,
        pinned: seed.pinned ?? false,
        createdAt,
        lastActivityAt: ago(lastReply * HOUR),
      },
    });

    for (const reply of seed.replies) {
      await prisma.communityPost.create({
        data: {
          threadId: thread.id,
          authorId: userIds[reply.author]!,
          body: reply.body,
          createdAt: ago(reply.ageHours * HOUR),
        },
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Clearing existing data…");
  await reset();

  console.log("Creating people…");
  const userIds: string[] = [];
  for (const person of people) {
    const user = await prisma.user.create({
      data: {
        email: person.email.toLowerCase(),
        passwordHash: await bcrypt.hash(person.password, 12),
        name: person.name,
        role: person.role,
        headline: person.headline,
        country: person.country,
        bio: person.bio,
      },
    });
    userIds.push(user.id);
  }
  const [adminId, danielId, amaId, tundeId, priyaId, instructorId] = userIds as [
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  console.log("Creating courses and generating download packs…");
  const courseIdBySlug = new Map<string, string>();
  for (const spec of courseSpecs) {
    const owner = spec.slug === "academy-orientation" ? adminId : instructorId;
    const course = await createCourse(spec, owner);
    courseIdBySlug.set(spec.slug, course.id);
    const resourceCount = await prisma.resource.count({ where: { courseId: course.id } });
    console.log(`  · ${spec.title} — ${resourceCount} downloads generated`);
  }

  console.log("Enrolling learners…");

  // The demo student: one course finished with a certificate, one well under
  // way, one just started. Enough state to exercise every screen.
  await enrolAndProgress(amaId, adminId, "academy-orientation", {
    through: 1,
    finish: true,
    enrolledDaysAgo: 46,
  });
  await enrolAndProgress(amaId, instructorId, "consulting-practice-foundations", {
    through: 0.55,
    enrolledDaysAgo: 24,
  });
  await enrolAndProgress(amaId, instructorId, "client-acquisition-systems", {
    through: 0.3,
    submitAssignments: false,
    enrolledDaysAgo: 4,
  });

  await enrolAndProgress(danielId, adminId, "academy-orientation", {
    through: 1,
    finish: true,
    enrolledDaysAgo: 70,
  });
  await enrolAndProgress(danielId, instructorId, "consulting-practice-foundations", {
    through: 1,
    finish: true,
    enrolledDaysAgo: 58,
  });
  await enrolAndProgress(danielId, instructorId, "client-acquisition-systems", {
    through: 0.5,
    gradeAssignments: false,
    enrolledDaysAgo: 12,
  });

  await enrolAndProgress(tundeId, adminId, "academy-orientation", {
    through: 0.5,
    enrolledDaysAgo: 9,
  });
  await enrolAndProgress(tundeId, instructorId, "ai-operations-for-small-teams", {
    through: 0.5,
    gradeAssignments: false,
    enrolledDaysAgo: 7,
  });

  await enrolAndProgress(priyaId, adminId, "academy-orientation", {
    through: 1,
    finish: true,
    enrolledDaysAgo: 88,
  });
  await enrolAndProgress(priyaId, instructorId, "client-acquisition-systems", {
    through: 1,
    finish: true,
    enrolledDaysAgo: 63,
  });
  await enrolAndProgress(priyaId, instructorId, "ai-operations-for-small-teams", {
    through: 0.25,
    enrolledDaysAgo: 5,
  });

  // An abandoned checkout, so the orders screen is not uniformly happy.
  await prisma.order.create({
    data: {
      userId: tundeId,
      courseId: courseIdBySlug.get("client-acquisition-systems")!,
      provider: "mock",
      providerRef: "mock_seed_abandoned_checkout",
      amountCents: 29900,
      currency: process.env.PAYMENTS_CURRENCY ?? "USD",
      status: "PENDING",
      createdAt: ago(2 * DAY),
    },
  });

  console.log("Seeding the community…");
  await createCommunity(userIds, courseIdBySlug);

  const [courseCount, lessonCount, resourceCount, certificateCount, threadCount] =
    await Promise.all([
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.resource.count(),
      prisma.certificate.count(),
      prisma.communityThread.count(),
    ]);

  console.log(`
Done.

  ${courseCount} courses · ${lessonCount} lessons · ${resourceCount} downloads
  ${certificateCount} certificates issued · ${threadCount} community threads

Sign in with:
  Student  ${STUDENT_EMAIL}  /  ${STUDENT_PASSWORD}
  Admin    ${ADMIN_EMAIL}  /  ${ADMIN_PASSWORD}
`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
