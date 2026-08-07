/**
 * Regenerates the downloadable course material without touching the database.
 *
 * This runs on every deploy. The seed also generates these files, but the seed
 * *clears the database first* — running it on each build would delete real
 * learners. Splitting the two means a deploy can safely rebuild the documents
 * while leaving enrolments, submissions and certificates alone.
 *
 * Safe because file paths are derived from course and lesson slugs, never from
 * database ids: regenerating produces exactly the paths the existing Resource
 * rows already point at.
 *
 *   npm run content:build
 */

import { buildCourseResource, buildLessonResources } from "../prisma/content/resource-builder";
import { courseSpecs } from "../prisma/content/courses";

async function main() {
  let files = 0;
  let bytes = 0;

  for (const course of courseSpecs) {
    for (const courseModule of course.modules) {
      for (const lesson of courseModule.lessons) {
        const built = await buildLessonResources(course.slug, course.title, lesson);
        files += built.length;
        bytes += built.reduce((sum, r) => sum + r.sizeBytes, 0);
      }
    }

    for (const [index, spec] of (course.courseResources ?? []).entries()) {
      const built = await buildCourseResource(course.slug, course.title, spec, index);
      files += 1;
      bytes += built.sizeBytes;
    }

    console.log(`  · ${course.title}`);
  }

  console.log(`\nGenerated ${files} documents (${(bytes / 1024 / 1024).toFixed(1)} MB).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
