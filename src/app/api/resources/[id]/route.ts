import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { canAccessCourse } from "@/lib/access";
import { contentFileExists, readContentStream } from "@/lib/content-store";

/**
 * The only way to get a course download.
 *
 * Files live outside `public/`, so there is no static URL to guess or share.
 * Every request re-checks enrolment, and each successful download is recorded
 * — which is also how instructors see which material is actually used.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const resource = await prisma.resource.findUnique({
    where: { id },
    select: {
      id: true,
      courseId: true,
      fileName: true,
      filePath: true,
      mimeType: true,
      externalUrl: true,
      lesson: { select: { isPreview: true } },
    },
  });

  if (!resource) {
    return new Response("Not found", { status: 404 });
  }

  if (resource.externalUrl) {
    return Response.redirect(resource.externalUrl, 302);
  }

  const user = await getCurrentUser();
  const isPreviewMaterial = resource.lesson?.isPreview === true;

  if (!isPreviewMaterial) {
    if (!user) {
      return new Response("Sign in to download course material.", { status: 401 });
    }
    if (!(await canAccessCourse(user, resource.courseId))) {
      return new Response("You need to enrol in this course to download this.", {
        status: 403,
      });
    }
  }

  if (!(await contentFileExists(resource.filePath))) {
    // The row exists but the file does not — almost always an un-seeded
    // instance. Say so plainly rather than returning an empty download.
    return new Response(
      "This file has not been generated yet. Run `npm run db:seed` to build the download packs.",
      { status: 404 },
    );
  }

  if (user) {
    await prisma.resourceDownload.create({
      data: { resourceId: resource.id, userId: user.id },
    });
  }

  const nodeStream = readContentStream(resource.filePath);
  const body = Readable.toWeb(nodeStream) as WebReadableStream<Uint8Array>;

  return new Response(body as unknown as ReadableStream, {
    headers: {
      "Content-Type": resource.mimeType,
      "Content-Disposition": `attachment; filename="${resource.fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
