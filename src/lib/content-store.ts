import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Where downloadable material lives on disk.
 *
 * Deliberately outside `public/`: a worksheet a learner paid for must not be
 * guessable at a static URL. Every download is served by an access-checked
 * route handler that streams from here.
 *
 * Swapping this for S3/R2 later means reimplementing the four functions below
 * and nothing else.
 */

const CONTENT_ROOT = process.env.CONTENT_ROOT
  ? path.resolve(process.env.CONTENT_ROOT)
  : path.join(process.cwd(), "content");

/**
 * Resolves a stored relative path to an absolute one, refusing anything that
 * escapes the content root. Paths come from the database, but a bad import or
 * a compromised admin form should not turn into arbitrary file reads.
 */
export function resolveContentPath(relativePath: string): string {
  const normalised = path
    .normalize(relativePath)
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .replace(/^[/\\]+/, "");
  const absolute = path.resolve(CONTENT_ROOT, normalised);

  if (absolute !== CONTENT_ROOT && !absolute.startsWith(CONTENT_ROOT + path.sep)) {
    throw new Error(`Refusing to read outside the content root: ${relativePath}`);
  }
  return absolute;
}

export async function writeContentFile(
  relativePath: string,
  data: Buffer | string,
): Promise<number> {
  const absolute = resolveContentPath(relativePath);
  await mkdir(path.dirname(absolute), { recursive: true });
  const buffer = typeof data === "string" ? Buffer.from(data, "utf8") : data;
  await writeFile(absolute, buffer);
  return buffer.byteLength;
}

export async function contentFileExists(relativePath: string): Promise<boolean> {
  try {
    const info = await stat(resolveContentPath(relativePath));
    return info.isFile();
  } catch {
    return false;
  }
}

/** Node stream for a stored file, ready to hand to a Response body. */
export function readContentStream(relativePath: string) {
  return createReadStream(resolveContentPath(relativePath));
}

export const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json",
};

export function mimeTypeFor(fileName: string): string {
  return MIME_TYPES[path.extname(fileName).toLowerCase()] ?? "application/octet-stream";
}
