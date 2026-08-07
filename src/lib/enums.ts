/**
 * SQLite has no native enum type, so these live as strings in the database and
 * are constrained here. Keeping them in one place means switching the Prisma
 * provider to Postgres later is a schema change, not an application rewrite.
 */

export const ROLES = ["STUDENT", "INSTRUCTOR", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type CourseLevel = (typeof COURSE_LEVELS)[number];

export const ENROLLMENT_STATUSES = ["ACTIVE", "COMPLETED", "CANCELLED"] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export const SUBMISSION_STATUSES = ["SUBMITTED", "GRADED", "RETURNED"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const QUESTION_TYPES = ["SINGLE", "MULTI", "TRUE_FALSE"] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const ORDER_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const THREAD_CATEGORIES = [
  "GENERAL",
  "QUESTION",
  "WIN",
  "RESOURCE",
  "INTRO",
] as const;
export type ThreadCategory = (typeof THREAD_CATEGORIES)[number];

export const THREAD_CATEGORY_LABELS: Record<ThreadCategory, string> = {
  GENERAL: "Discussion",
  QUESTION: "Question",
  WIN: "Win",
  RESOURCE: "Resource",
  INTRO: "Introduction",
};

/**
 * The download types every lesson can carry. Order here is the order they are
 * grouped in the lesson sidebar.
 */
export const RESOURCE_KINDS = [
  "PDF_NOTES",
  "CHECKLIST",
  "TEMPLATE",
  "SOP",
  "WORKSHEET",
  "PROMPT_LIBRARY",
  "PRACTICE_EXERCISE",
  "SLIDES",
  "DATASET",
  "LINK",
] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export const RESOURCE_KIND_META: Record<
  ResourceKind,
  { label: string; icon: string; blurb: string }
> = {
  PDF_NOTES: {
    label: "PDF notes",
    icon: "📄",
    blurb: "The lesson written up so you can revise without rewatching.",
  },
  CHECKLIST: {
    label: "Checklist",
    icon: "☑️",
    blurb: "Tick-through list to run the process without missing a step.",
  },
  TEMPLATE: {
    label: "Template",
    icon: "🧩",
    blurb: "Fill-in-the-blanks starting point you can reuse.",
  },
  SOP: {
    label: "SOP",
    icon: "📘",
    blurb: "Standard operating procedure to hand to your team.",
  },
  WORKSHEET: {
    label: "Worksheet",
    icon: "📝",
    blurb: "Guided exercise to apply the lesson to your own business.",
  },
  PROMPT_LIBRARY: {
    label: "Prompt library",
    icon: "💬",
    blurb: "Copy-paste AI prompts tuned for this workflow.",
  },
  PRACTICE_EXERCISE: {
    label: "Practice exercise",
    icon: "🏋️",
    blurb: "Drills to build the skill through repetition.",
  },
  SLIDES: {
    label: "Slides",
    icon: "📊",
    blurb: "The deck used in the video.",
  },
  DATASET: {
    label: "Dataset",
    icon: "🗂️",
    blurb: "Sample data to work through the exercise with.",
  },
  LINK: {
    label: "Link",
    icon: "🔗",
    blurb: "External reading or tool.",
  },
};

export function isResourceKind(value: string): value is ResourceKind {
  return (RESOURCE_KINDS as readonly string[]).includes(value);
}

export function resourceMeta(kind: string) {
  return isResourceKind(kind) ? RESOURCE_KIND_META[kind] : RESOURCE_KIND_META.LINK;
}

/** Safely read a JSON string column that holds an array of strings. */
export function parseStringList(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}
