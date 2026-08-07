import type { CourseLevel, QuestionType, ResourceKind } from "../../src/lib/enums";

/**
 * Authoring format for course content.
 *
 * Course material is written here as structured data rather than prose blobs
 * so that the downloadable pack for each lesson can be *generated* from the
 * same source as the lesson itself. Author the steps once and the SOP, the
 * checklist and the PDF notes all stay in sync — no drift between what the
 * video teaches and what the worksheet asks for.
 *
 * See ./resource-builder.ts for which arrays produce which download.
 */

export type LessonSpec = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  videoUrl?: string;
  /** Watchable before enrolling — used to give the catalog a real taster. */
  isPreview?: boolean;
  /** Lesson body, in the Markdown subset supported by src/lib/markdown.ts. */
  body: string;

  /** The three-to-five things a learner must remember. → PDF notes */
  keyPoints: string[];
  /** The procedure, in order. → SOP + template */
  steps?: string[];
  /** Pre-flight / done-check items. → Checklist */
  checklist?: string[];
  /** Reflection questions applied to the learner's own business. → Worksheet */
  worksheet?: string[];
  /** Copy-paste AI prompts for this workflow. → Prompt library */
  prompts?: Array<{ name: string; prompt: string }>;
  /** Repetition drills. → Practice exercise */
  practice?: string[];
  /** Optional tabular starting point. → CSV template */
  table?: { fileLabel: string; columns: string[]; sampleRows: string[][] };
};

export type QuestionSpec = {
  prompt: string;
  type?: QuestionType;
  explanation?: string;
  points?: number;
  /** Correct options are marked with a leading "*". */
  choices: string[];
};

export type QuizSpec = {
  title: string;
  description?: string;
  passMark?: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  questions: QuestionSpec[];
};

export type ModuleSpec = {
  title: string;
  summary: string;
  lessons: LessonSpec[];
  /** End-of-module knowledge check. */
  quiz?: QuizSpec;
  assignment?: AssignmentSpec;
};

export type AssignmentSpec = {
  title: string;
  briefMd: string;
  deliverables: string[];
  points?: number;
  dueInDays?: number;
};

export type CourseSpec = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: CourseLevel;
  priceCents: number;
  estimatedHours: number;
  featured?: boolean;
  welcomeVideoUrl?: string;
  welcomeVideoNote: string;
  outcomes: string[];
  requirements: string[];
  passMark?: number;
  modules: ModuleSpec[];
  /** Whole-course final assessment. */
  finalQuiz: QuizSpec;
  /** Capstone, separate from the per-module assignments. */
  capstone: AssignmentSpec;
  /** Course-wide downloads, not tied to one lesson. */
  courseResources?: Array<{
    kind: ResourceKind;
    title: string;
    description: string;
    sections: Array<{ heading: string; items: string[] }>;
  }>;
};
