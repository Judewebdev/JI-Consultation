import { renderPdf, type PdfBlock } from "../../src/lib/pdf";
import { writeContentFile, mimeTypeFor } from "../../src/lib/content-store";
import type { ResourceKind } from "../../src/lib/enums";
import type { LessonSpec } from "./types";

/**
 * Turns an authored lesson into its download pack.
 *
 * Every lesson ships PDF notes; the rest of the pack is produced from
 * whichever authoring arrays the lesson filled in. Files are written under
 * content/resources/<course>/<lesson>/ and the returned rows are what the
 * seed inserts into the Resource table.
 */

export type BuiltResource = {
  kind: ResourceKind;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  position: number;
};

const BRAND = "JI Global Academy";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export async function buildLessonResources(
  courseSlug: string,
  courseTitle: string,
  lesson: LessonSpec,
): Promise<BuiltResource[]> {
  const dir = `resources/${courseSlug}/${lesson.slug}`;
  const built: BuiltResource[] = [];
  let position = 0;

  const add = async (
    kind: ResourceKind,
    title: string,
    description: string,
    fileName: string,
    data: Buffer | string,
  ) => {
    const filePath = `${dir}/${fileName}`;
    const sizeBytes = await writeContentFile(filePath, data);
    built.push({
      kind,
      title,
      description,
      fileName,
      filePath,
      mimeType: mimeTypeFor(fileName),
      sizeBytes,
      position: position++,
    });
  };

  const subtitle = `${courseTitle} · ${lesson.title}`;

  // ---- PDF notes -----------------------------------------------------------
  {
    const blocks: PdfBlock[] = [
      { type: "text", text: lesson.summary },
      { type: "rule" },
      { type: "heading", text: "Key points" },
      ...lesson.keyPoints.map((text): PdfBlock => ({ type: "bullet", text })),
    ];

    if (lesson.steps?.length) {
      blocks.push({ type: "heading", text: "The process, step by step" });
      lesson.steps.forEach((step, index) => {
        blocks.push({ type: "bullet", text: `Step ${index + 1}. ${step}` });
      });
    }

    if (lesson.worksheet?.length) {
      blocks.push({ type: "heading", text: "Questions to sit with" });
      lesson.worksheet.forEach((q) => blocks.push({ type: "bullet", text: q }));
    }

    blocks.push(
      { type: "rule" },
      {
        type: "text",
        text:
          "These notes cover the same ground as the video. Use them to revise " +
          "before the module quiz, and keep them beside you when you do the " +
          "assignment.",
      },
    );

    await add(
      "PDF_NOTES",
      `${lesson.title} — lesson notes`,
      "The full lesson written up, so you can revise without rewatching.",
      `${pad(position + 1)}-${lesson.slug}-notes.pdf`,
      renderPdf({ title: lesson.title, subtitle, footer: BRAND, blocks }),
    );
  }

  // ---- Checklist -----------------------------------------------------------
  if (lesson.checklist?.length) {
    const blocks: PdfBlock[] = [
      {
        type: "text",
        text: "Work down this list each time you run the process. Nothing here is optional.",
      },
      { type: "rule" },
      ...lesson.checklist.map((text): PdfBlock => ({ type: "checkbox", text })),
      { type: "spacer" },
      { type: "heading", text: "Notes" },
      { type: "text", text: " " },
      { type: "rule" },
      { type: "text", text: " " },
      { type: "rule" },
    ];

    await add(
      "CHECKLIST",
      `${lesson.title} — checklist`,
      "Tick-through list so you can run this without missing a step.",
      `${pad(position + 1)}-${lesson.slug}-checklist.pdf`,
      renderPdf({ title: `${lesson.title}: checklist`, subtitle, footer: BRAND, blocks }),
    );
  }

  // ---- SOP -----------------------------------------------------------------
  if (lesson.steps && lesson.steps.length >= 3) {
    const blocks: PdfBlock[] = [
      {
        type: "text",
        text:
          "A standard operating procedure you can hand to someone else. Written " +
          "so a capable person who has not taken this course can still follow it.",
      },
      { type: "heading", text: "Purpose" },
      { type: "text", text: lesson.summary },
      { type: "heading", text: "Procedure" },
    ];

    lesson.steps.forEach((step, index) => {
      blocks.push({ type: "heading", text: `${index + 1}. ${step.split(/[.:]/)[0]!.trim()}` });
      blocks.push({ type: "text", text: step });
    });

    blocks.push(
      { type: "heading", text: "Definition of done" },
      ...(lesson.checklist ?? lesson.keyPoints).map(
        (text): PdfBlock => ({ type: "checkbox", text }),
      ),
      { type: "heading", text: "Revision history" },
      {
        type: "text",
        text: `v1.0 — issued by ${BRAND}. Replace this line when you adapt the SOP for your own team.`,
      },
    );

    await add(
      "SOP",
      `${lesson.title} — SOP`,
      "Standard operating procedure, ready to hand to your team.",
      `${pad(position + 1)}-${lesson.slug}-sop.pdf`,
      renderPdf({ title: `SOP: ${lesson.title}`, subtitle, footer: BRAND, blocks }),
    );
  }

  // ---- Template ------------------------------------------------------------
  if (lesson.table) {
    const rows = [lesson.table.columns, ...lesson.table.sampleRows];
    const csv = rows
      .map((row) =>
        row
          .map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell))
          .join(","),
      )
      .join("\n");

    await add(
      "TEMPLATE",
      `${lesson.table.fileLabel} (spreadsheet)`,
      "Open in Excel, Numbers or Google Sheets. The first rows are worked examples — overwrite them.",
      `${pad(position + 1)}-${lesson.slug}-template.csv`,
      `${csv}\n`,
    );
  } else if (lesson.steps?.length) {
    const md = [
      `# ${lesson.title} — working template`,
      "",
      `_${courseTitle} · ${BRAND}_`,
      "",
      "Copy this file, then fill it in for your own business. Delete the prompts in _italics_ as you replace them.",
      "",
      "## Context",
      "",
      "_What situation are you applying this to? One paragraph._",
      "",
      ...lesson.steps.flatMap((step, index) => [
        `## Step ${index + 1} — ${step.split(/[.:]/)[0]!.trim()}`,
        "",
        `_${step}_`,
        "",
        "**Your answer:**",
        "",
        "",
      ]),
      "## Decision",
      "",
      "_What are you going to do, by when, and how will you know it worked?_",
      "",
    ].join("\n");

    await add(
      "TEMPLATE",
      `${lesson.title} — working template`,
      "Fill-in-the-blanks version of the process, ready to reuse.",
      `${pad(position + 1)}-${lesson.slug}-template.md`,
      md,
    );
  }

  // ---- Worksheet -----------------------------------------------------------
  if (lesson.worksheet?.length) {
    const md = [
      `# ${lesson.title} — worksheet`,
      "",
      `_${courseTitle} · ${BRAND}_`,
      "",
      lesson.summary,
      "",
      "Answer these against your own business, not in the abstract. Vague answers here become vague work later.",
      "",
      "---",
      "",
      ...lesson.worksheet.flatMap((question, index) => [
        `### ${index + 1}. ${question}`,
        "",
        "",
        "",
        "---",
        "",
      ]),
      "## What I am changing this week",
      "",
      "1. ",
      "2. ",
      "3. ",
      "",
    ].join("\n");

    await add(
      "WORKSHEET",
      `${lesson.title} — worksheet`,
      "Guided exercise that applies the lesson to your own situation.",
      `${pad(position + 1)}-${lesson.slug}-worksheet.md`,
      md,
    );
  }

  // ---- Prompt library ------------------------------------------------------
  if (lesson.prompts?.length) {
    const md = [
      `# ${lesson.title} — prompt library`,
      "",
      `_${courseTitle} · ${BRAND}_`,
      "",
      "Paste these into the assistant of your choice. Replace everything in `[SQUARE BRACKETS]` before you send it — a prompt with the placeholders left in produces generic output, every time.",
      "",
      "---",
      "",
      ...lesson.prompts.flatMap((entry) => [
        `## ${entry.name}`,
        "",
        "```",
        entry.prompt,
        "```",
        "",
      ]),
      "## How to get more out of these",
      "",
      "- Give the model your real numbers. Made-up context produces made-up advice.",
      "- Ask it to show its reasoning before its recommendation, then check the reasoning.",
      "- If the first answer is generic, tell it what was generic about it and ask again.",
      "",
    ].join("\n");

    await add(
      "PROMPT_LIBRARY",
      `${lesson.title} — prompt library`,
      "Copy-paste AI prompts tuned for this workflow.",
      `${pad(position + 1)}-${lesson.slug}-prompts.md`,
      md,
    );
  }

  // ---- Practice exercises --------------------------------------------------
  if (lesson.practice?.length) {
    const md = [
      `# ${lesson.title} — practice exercises`,
      "",
      `_${courseTitle} · ${BRAND}_`,
      "",
      "Skill comes from reps, not from watching. Do these in order; each one takes 10–20 minutes.",
      "",
      ...lesson.practice.flatMap((exercise, index) => [
        `### Exercise ${index + 1}`,
        "",
        exercise,
        "",
        "**Time-box:** 15 minutes. **Done when:** you have something written down you would be willing to show someone.",
        "",
        "---",
        "",
      ]),
      "## Post them",
      "",
      "Share what you produced in the course community. Feedback on real work beats another lesson.",
      "",
    ].join("\n");

    await add(
      "PRACTICE_EXERCISE",
      `${lesson.title} — practice exercises`,
      "Drills to turn the lesson into a skill you actually have.",
      `${pad(position + 1)}-${lesson.slug}-practice.md`,
      md,
    );
  }

  return built;
}

/** Course-wide downloads (workbooks, indexes) that are not tied to a lesson. */
export async function buildCourseResource(
  courseSlug: string,
  courseTitle: string,
  spec: {
    kind: ResourceKind;
    title: string;
    description: string;
    sections: Array<{ heading: string; items: string[] }>;
  },
  position: number,
): Promise<BuiltResource> {
  const blocks: PdfBlock[] = [];
  for (const section of spec.sections) {
    blocks.push({ type: "heading", text: section.heading });
    for (const item of section.items) {
      blocks.push({
        type: spec.kind === "CHECKLIST" ? "checkbox" : "bullet",
        text: item,
      });
    }
  }

  const slugPart = spec.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const fileName = `${pad(position + 1)}-${slugPart}.pdf`;
  const filePath = `resources/${courseSlug}/_course/${fileName}`;

  const sizeBytes = await writeContentFile(
    filePath,
    renderPdf({ title: spec.title, subtitle: courseTitle, footer: BRAND, blocks }),
  );

  return {
    kind: spec.kind,
    title: spec.title,
    description: spec.description,
    fileName,
    filePath,
    mimeType: "application/pdf",
    sizeBytes,
    position,
  };
}
