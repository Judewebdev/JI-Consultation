/**
 * Quiz grading.
 *
 * Kept free of Prisma and Next imports so the same function grades an attempt
 * in a server action, in the seed, and in a unit test. If grading lived in the
 * route handler, the seeded scores and the real ones would eventually diverge.
 *
 * Rule: a question scores its points only when the selected set of choices is
 * exactly the correct set. Partial credit on a multi-select would let someone
 * pass by ticking everything.
 */

export type GradableChoice = { id: string; isCorrect: boolean };
export type GradableQuestion = {
  id: string;
  points: number;
  choices: GradableChoice[];
};

/** questionId → the choice ids the learner selected. */
export type QuizAnswers = Record<string, string[]>;

export type QuestionResult = {
  questionId: string;
  selectedIds: string[];
  correctIds: string[];
  isCorrect: boolean;
  pointsAwarded: number;
  pointsAvailable: number;
};

export type QuizResult = {
  scorePercent: number;
  pointsAwarded: number;
  pointsAvailable: number;
  correctCount: number;
  questionCount: number;
  results: QuestionResult[];
};

export function gradeQuiz(
  questions: GradableQuestion[],
  answers: QuizAnswers,
): QuizResult {
  const results: QuestionResult[] = questions.map((question) => {
    const correctIds = question.choices.filter((c) => c.isCorrect).map((c) => c.id);
    const validIds = new Set(question.choices.map((c) => c.id));

    // Ignore anything that is not a choice on this question, and de-duplicate:
    // a hand-crafted form post should not be able to inflate a score.
    const selectedIds = [...new Set(answers[question.id] ?? [])].filter((id) =>
      validIds.has(id),
    );

    const isCorrect =
      correctIds.length > 0 &&
      selectedIds.length === correctIds.length &&
      correctIds.every((id) => selectedIds.includes(id));

    return {
      questionId: question.id,
      selectedIds,
      correctIds,
      isCorrect,
      pointsAwarded: isCorrect ? question.points : 0,
      pointsAvailable: question.points,
    };
  });

  const pointsAvailable = results.reduce((sum, r) => sum + r.pointsAvailable, 0);
  const pointsAwarded = results.reduce((sum, r) => sum + r.pointsAwarded, 0);

  return {
    scorePercent:
      pointsAvailable === 0 ? 0 : Math.round((pointsAwarded / pointsAvailable) * 100),
    pointsAwarded,
    pointsAvailable,
    correctCount: results.filter((r) => r.isCorrect).length,
    questionCount: results.length,
    results,
  };
}

export function parseAnswers(json: string | null | undefined): QuizAnswers {
  if (!json) return {};
  try {
    const parsed: unknown = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const answers: QuizAnswers = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        answers[key] = value.filter((v): v is string => typeof v === "string");
      }
    }
    return answers;
  } catch {
    return {};
  }
}
