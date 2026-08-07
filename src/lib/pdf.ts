/**
 * A tiny PDF writer.
 *
 * The academy hands out real PDFs (lesson notes, SOPs, certificates), and a
 * text-only document is simple enough to emit directly — no dependency, no
 * headless browser, and it runs anywhere Node runs. Uses the base-14
 * Helvetica faces, which every reader has built in, so no font embedding.
 */

export type PdfBlock =
  | { type: "title"; text: string }
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "bullet"; text: string }
  | { type: "checkbox"; text: string }
  | { type: "rule" }
  | { type: "spacer" };

type Font = "Helvetica" | "Helvetica-Bold" | "Helvetica-Oblique";

const PAGE_WIDTH = 595.28; // A4 at 72dpi
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = MARGIN + 28; // leave room for the footer

/**
 * Helvetica advance widths (per 1000 units) for the printable ASCII range.
 * Enough for accurate wrapping without shipping full font metrics.
 */
const WIDTHS: Record<string, number> = (() => {
  const table: Record<string, number> = {};
  const groups: Array<[string, number]> = [
    [" !", 278],
    ['"', 355],
    ["#$", 556],
    ["%", 889],
    ["&", 667],
    ["'", 191],
    ["()", 333],
    ["*", 389],
    ["+", 584],
    [",", 278],
    ["-", 333],
    [".", 278],
    ["/", 278],
    ["0123456789", 556],
    [":;", 278],
    ["<=>", 584],
    ["?", 556],
    ["@", 1015],
    ["ABDEHNRU", 722],
    ["C", 722],
    ["FG", 667],
    ["I", 278],
    ["J", 500],
    ["KLPSVXY", 667],
    ["MW", 889],
    ["OQ", 778],
    ["T", 611],
    ["Z", 611],
    ["[]", 278],
    ["\\", 278],
    ["^", 469],
    ["_", 556],
    ["`", 333],
    ["abcdeghnopqsu", 556],
    ["f", 278],
    ["ijl", 222],
    ["k", 500],
    ["m", 833],
    ["r", 333],
    ["t", 278],
    ["vxyz", 500],
    ["w", 722],
    ["{}", 334],
    ["|", 260],
    ["~", 584],
  ];
  for (const [chars, width] of groups) {
    for (const char of chars) table[char] = width;
  }
  return table;
})();

function charWidth(char: string, size: number): number {
  return ((WIDTHS[char] ?? 556) / 1000) * size;
}

function textWidth(text: string, size: number): number {
  let total = 0;
  for (const char of text) total += charWidth(char, size);
  return total;
}

/** Drop anything outside Latin-1 so the base-14 encoding stays valid. */
function toLatin1(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[•▪]/g, "\xB7")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
}

function escapePdfString(text: string): string {
  return toLatin1(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, size: number, maxWidth: number): string[] {
  const words = toLatin1(text).split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (textWidth(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

type PageOps = string[];

export function renderPdf(options: {
  title: string;
  subtitle?: string;
  footer?: string;
  blocks: PdfBlock[];
}): Buffer {
  const pages: PageOps[] = [];
  let ops: PageOps = [];
  let y = PAGE_HEIGHT - MARGIN;

  const newPage = () => {
    pages.push(ops);
    ops = [];
    y = PAGE_HEIGHT - MARGIN;
  };

  const ensure = (needed: number) => {
    if (y - needed < BOTTOM_LIMIT) newPage();
  };

  const drawText = (text: string, size: number, font: Font, x: number) => {
    ops.push(
      "BT",
      `/${font === "Helvetica" ? "F1" : font === "Helvetica-Bold" ? "F2" : "F3"} ${size} Tf`,
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${escapePdfString(text)}) Tj`,
      "ET",
    );
  };

  const paragraph = (
    text: string,
    size: number,
    font: Font,
    indent = 0,
    leading = size * 1.45,
  ) => {
    const lines = wrap(text, size, CONTENT_WIDTH - indent);
    for (const line of lines) {
      ensure(leading);
      y -= leading;
      drawText(line, size, font, MARGIN + indent);
    }
  };

  // Header
  paragraph(options.title, 20, "Helvetica-Bold");
  if (options.subtitle) {
    y -= 4;
    paragraph(options.subtitle, 10.5, "Helvetica-Oblique");
  }
  y -= 10;
  ops.push(
    "0.85 0.85 0.85 RG",
    "1 w",
    `${MARGIN} ${y.toFixed(2)} m ${(PAGE_WIDTH - MARGIN).toFixed(2)} ${y.toFixed(2)} l S`,
    "0 0 0 RG",
  );
  y -= 8;

  for (const block of options.blocks) {
    switch (block.type) {
      case "title":
        y -= 10;
        paragraph(block.text, 16, "Helvetica-Bold");
        break;
      case "heading":
        y -= 8;
        paragraph(block.text, 12.5, "Helvetica-Bold");
        break;
      case "text":
        y -= 3;
        paragraph(block.text, 10.5, "Helvetica");
        break;
      case "bullet": {
        y -= 2;
        const lines = wrap(block.text, 10.5, CONTENT_WIDTH - 18);
        lines.forEach((line, index) => {
          ensure(15);
          y -= 15;
          if (index === 0) drawText("•", 10.5, "Helvetica", MARGIN + 4);
          drawText(line, 10.5, "Helvetica", MARGIN + 18);
        });
        break;
      }
      case "checkbox": {
        y -= 3;
        const lines = wrap(block.text, 10.5, CONTENT_WIDTH - 24);
        lines.forEach((line, index) => {
          ensure(16);
          y -= 16;
          if (index === 0) {
            ops.push(
              "0.4 0.4 0.4 RG",
              "0.8 w",
              `${MARGIN + 3} ${(y - 1).toFixed(2)} 9 9 re S`,
              "0 0 0 RG",
            );
          }
          drawText(line, 10.5, "Helvetica", MARGIN + 22);
        });
        break;
      }
      case "rule":
        ensure(16);
        y -= 12;
        ops.push(
          "0.88 0.88 0.88 RG",
          "1 w",
          `${MARGIN} ${y.toFixed(2)} m ${(PAGE_WIDTH - MARGIN).toFixed(2)} ${y.toFixed(2)} l S`,
          "0 0 0 RG",
        );
        break;
      case "spacer":
        y -= 10;
        break;
    }
  }
  pages.push(ops);

  // Footer on every page
  const footer = options.footer ?? "JI Global Academy";
  const finished = pages.map((pageOps, index) => {
    const label = `${footer}  ·  Page ${index + 1} of ${pages.length}`;
    return [
      ...pageOps,
      "BT",
      "/F1 8 Tf",
      "0.45 0.45 0.45 rg",
      `1 0 0 1 ${MARGIN} ${MARGIN - 18} Tm`,
      `(${escapePdfString(label)}) Tj`,
      "ET",
      "0 0 0 rg",
    ].join("\n");
  });

  return assemble(finished);
}

function assemble(pageStreams: string[]): Buffer {
  const objects: string[] = [];
  const pageCount = pageStreams.length;

  // Object numbering: 1 catalog, 2 pages, 3-5 fonts, then page/content pairs.
  const firstPageObj = 6;
  const kids = Array.from(
    { length: pageCount },
    (_, i) => `${firstPageObj + i * 2} 0 R`,
  ).join(" ");

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[4] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
  objects[5] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>";

  pageStreams.forEach((stream, index) => {
    const pageObj = firstPageObj + index * 2;
    const contentObj = pageObj + 1;
    objects[pageObj] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objects[contentObj] =
      `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`;
  });

  const chunks: Buffer[] = [];
  const offsets: number[] = [];
  let cursor = 0;

  const push = (text: string) => {
    const buffer = Buffer.from(text, "latin1");
    chunks.push(buffer);
    cursor += buffer.length;
  };

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

  for (let i = 1; i < objects.length; i += 1) {
    offsets[i] = cursor;
    push(`${i} 0 obj\n${objects[i]}\nendobj\n`);
  }

  const xrefOffset = cursor;
  const total = objects.length; // objects.length - 1 real objects, plus slot 0
  let xref = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  push(xref);
  push(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return Buffer.concat(chunks);
}
