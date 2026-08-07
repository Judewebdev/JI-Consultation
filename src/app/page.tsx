import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/format";
import { RESOURCE_KIND_META } from "@/lib/enums";
import { Badge, ButtonLink, Card } from "@/components/ui";

export default async function HomePage() {
  const [user, featured, stats] = await Promise.all([
    getCurrentUser(),
    prisma.course.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { priceCents: "asc" }],
      take: 3,
      select: {
        slug: true,
        title: true,
        subtitle: true,
        category: true,
        priceCents: true,
        currency: true,
        estimatedHours: true,
        _count: { select: { modules: true, resources: true } },
      },
    }),
    Promise.all([
      prisma.course.count({ where: { published: true } }),
      prisma.lesson.count(),
      prisma.resource.count(),
      prisma.certificate.count(),
    ]),
  ]);

  const [courseCount, lessonCount, resourceCount, certificateCount] = stats;

  return (
    <div>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-ink-700/50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 left-1/4 h-[24rem] w-[24rem] rounded-full bg-gold-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
            JI Consultation
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Training that changes what you do on Monday.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-200">
            Most business courses fail at the point of application, not explanation. Every
            course here ends in work applied to your own business — with the notes,
            checklists, templates and SOPs you need to actually run it.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink
              href={user ? "/dashboard" : "/register"}
              size="lg"
              className="bg-gold-500 text-ink-950 hover:bg-gold-400"
            >
              {user ? "Go to your dashboard" : "Start free with Orientation"}
            </ButtonLink>
            <ButtonLink
              href="/courses"
              size="lg"
              variant="secondary"
              className="bg-white/10 text-white ring-white/25 hover:bg-white/15"
            >
              Browse the catalog
            </ButtonLink>
          </div>

          <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {[
              [courseCount, "courses"],
              [lessonCount, "lessons"],
              [resourceCount, "downloads"],
              [certificateCount, "certificates issued"],
            ].map(([value, label]) => (
              <div key={String(label)}>
                <dt className="text-3xl font-semibold tracking-tight text-white">
                  {value as number}
                </dt>
                <dd className="mt-0.5 text-sm text-ink-300">{label as string}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------ what you get */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
          How a course works
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-ink-900">
          A welcome video, modules of lessons, and a download pack for every one of them.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Learn it",
              body: "A welcome video sets the destination. Modules break the capability down; each lesson is fifteen to twenty-five minutes and ends in something you do.",
            },
            {
              step: "02",
              title: "Apply it",
              body: "Every lesson carries a working pack — PDF notes, checklists, templates, SOPs, worksheets, prompt libraries and practice drills. Generated from the same source as the lesson, so they never contradict it.",
            },
            {
              step: "03",
              title: "Prove it",
              body: "Module quizzes catch misunderstandings early. Assignments are marked against your own business. The certificate is issued on completed work, and anyone can verify it.",
            },
          ].map((item) => (
            <Card key={item.step} className="p-7">
              <span className="text-xs font-semibold tracking-[0.14em] text-gold-600">
                {item.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- downloads */}
      <section className="border-y border-sand-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
                In every lesson
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
                The download pack is the point.
              </h2>
              <p className="mt-4 text-ink-500">
                Watching does not change how you work; using something while you work
                does. Every lesson ships with material designed to sit open on your desk
                while you do the job — not to be read once and filed.
              </p>
              <p className="mt-4 text-sm text-ink-400">
                Downloads are tied to your enrolment and served through an access check.
                They are never sitting at a public link.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  "PDF_NOTES",
                  "CHECKLIST",
                  "TEMPLATE",
                  "SOP",
                  "WORKSHEET",
                  "PROMPT_LIBRARY",
                  "PRACTICE_EXERCISE",
                  "SLIDES",
                ] as const
              ).map((kind) => {
                const meta = RESOURCE_KIND_META[kind];
                return (
                  <div
                    key={kind}
                    className="rounded-xl bg-sand-50 p-4 ring-1 ring-inset ring-sand-200"
                  >
                    <p className="text-sm font-semibold text-ink-900">
                      <span aria-hidden className="mr-1.5">
                        {meta.icon}
                      </span>
                      {meta.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">{meta.blurb}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- courses */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
              Catalog
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
              Where people usually start
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-sm font-medium text-ink-600 underline underline-offset-4 hover:text-ink-900"
          >
            See all {courseCount} courses
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((course) => (
            <Card key={course.slug} className="flex flex-col p-6">
              <div className="flex items-center gap-2">
                <Badge tone="neutral">{course.category}</Badge>
                {course.priceCents === 0 ? <Badge tone="moss">Free</Badge> : null}
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-ink-900">
                <Link href={`/courses/${course.slug}`} className="hover:underline">
                  {course.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                {course.subtitle}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-sand-200 pt-4">
                <span className="text-sm text-ink-400">
                  {course._count.modules} modules · {course._count.resources} downloads
                </span>
                <span className="text-sm font-semibold text-ink-900">
                  {formatPrice(course.priceCents, course.currency)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- cta */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="rounded-2xl bg-ink-900 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="text-3xl font-semibold tracking-tight">
            Start with Orientation. It is free and takes an hour.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-200">
            Set a 90-day outcome, learn how the platform fits together, and earn your
            first verifiable certificate before you spend anything.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink
              href={user ? "/courses/academy-orientation" : "/register"}
              size="lg"
              className="bg-gold-500 text-ink-950 hover:bg-gold-400"
            >
              {user ? "Open Orientation" : "Create your account"}
            </ButtonLink>
            <ButtonLink
              href="/certificates/verify"
              size="lg"
              variant="secondary"
              className="bg-white/10 text-white ring-white/25 hover:bg-white/15"
            >
              Verify a certificate
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
