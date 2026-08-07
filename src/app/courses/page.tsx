import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatDuration, formatPrice } from "@/lib/format";
import { parseStringList } from "@/lib/enums";
import { Badge, Card, ProgressBar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Course catalog",
  description:
    "Every JI Global Academy course: modules, lessons, downloadable working material, " +
    "assignments, quizzes and a verifiable certificate.",
};

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: "Foundational",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const user = await getCurrentUser();

  const [courses, categories, enrollments] = await Promise.all([
    prisma.course.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: [{ featured: "desc" }, { priceCents: "asc" }, { title: "asc" }],
      include: {
        instructor: { select: { name: true, headline: true } },
        _count: { select: { modules: true, resources: true, assignments: true } },
        modules: { select: { _count: { select: { lessons: true } } } },
      },
    }),
    prisma.course.findMany({
      where: { published: true },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
    user
      ? prisma.enrollment.findMany({
          where: { userId: user.id },
          select: { courseId: true, progressPercent: true, status: true },
        })
      : Promise.resolve([]),
  ]);

  const enrollmentByCourse = new Map(enrollments.map((e) => [e.courseId, e]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
          Catalog
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-900">
          Courses
        </h1>
        <p className="mt-4 text-lg text-ink-500">
          Each course is a welcome video, modules of short lessons, a working download
          pack for every lesson, assignments marked against your own business, quizzes,
          and a certificate anyone can verify.
        </p>
      </header>

      <nav className="mt-10 flex flex-wrap gap-2" aria-label="Filter by category">
        <FilterChip href="/courses" active={!category}>
          All courses
        </FilterChip>
        {categories.map(({ category: name }) => (
          <FilterChip
            key={name}
            href={`/courses?category=${encodeURIComponent(name)}`}
            active={category === name}
          >
            {name}
          </FilterChip>
        ))}
      </nav>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {courses.map((course) => {
          const lessonCount = course.modules.reduce((sum, m) => sum + m._count.lessons, 0);
          const enrollment = enrollmentByCourse.get(course.id);
          const outcomes = parseStringList(course.outcomesJson);

          return (
            <Card key={course.id} className="flex flex-col p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{course.category}</Badge>
                <Badge tone="neutral">{LEVEL_LABEL[course.level] ?? course.level}</Badge>
                {course.priceCents === 0 ? <Badge tone="moss">Free</Badge> : null}
                {enrollment ? (
                  <Badge tone="gold">
                    {enrollment.status === "COMPLETED" ? "Completed" : "Enrolled"}
                  </Badge>
                ) : null}
              </div>

              <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-900">
                <Link href={`/courses/${course.slug}`} className="hover:underline">
                  {course.title}
                </Link>
              </h2>
              <p className="mt-2 text-ink-500">{course.subtitle}</p>

              {outcomes.length ? (
                <ul className="mt-5 space-y-1.5 text-sm text-ink-600">
                  {outcomes.slice(0, 3).map((outcome) => (
                    <li key={outcome} className="flex gap-2.5">
                      <span aria-hidden className="mt-0.5 text-moss-500">
                        ✓
                      </span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {enrollment ? (
                <div className="mt-6">
                  <div className="mb-1.5 flex items-baseline justify-between text-xs">
                    <span className="font-medium text-ink-600">Your progress</span>
                    <span className="text-ink-400">{enrollment.progressPercent}%</span>
                  </div>
                  <ProgressBar percent={enrollment.progressPercent} />
                </div>
              ) : null}

              <dl className="mt-6 grid grid-cols-4 gap-3 border-t border-sand-200 pt-5 text-center">
                <Stat label="Modules" value={course._count.modules} />
                <Stat label="Lessons" value={lessonCount} />
                <Stat label="Downloads" value={course._count.resources} />
                <Stat label="Hours" value={course.estimatedHours} />
              </dl>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div className="text-sm text-ink-400">
                  {course.instructor ? (
                    <>
                      <span className="block font-medium text-ink-700">
                        {course.instructor.name}
                      </span>
                      <span>{course.instructor.headline}</span>
                    </>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-ink-900">
                    {formatPrice(course.priceCents, course.currency)}
                  </p>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-sm font-medium text-ink-600 underline underline-offset-4 hover:text-ink-900"
                  >
                    {enrollment ? "Continue" : "View course"}
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-xs text-ink-400">
                About {formatDuration(course.estimatedHours * 60)} of material ·{" "}
                {course._count.assignments} assignments
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-ink-900 px-4 py-1.5 text-sm font-medium text-white"
          : "rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink-600 ring-1 ring-inset ring-sand-200 hover:bg-sand-100"
      }
    >
      {children}
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block text-lg font-semibold text-ink-900">{value}</span>
        <span className="block text-[11px] uppercase tracking-wide text-ink-400">
          {label}
        </span>
      </dd>
    </div>
  );
}
