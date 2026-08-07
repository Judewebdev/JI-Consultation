import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/format";
import { Badge, ButtonLink, Card, EmptyState, ProgressBar } from "@/components/ui";

export const metadata: Metadata = { title: "Your certificates" };

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/certificates");

  const [certificates, inProgress] = await Promise.all([
    prisma.certificate.findMany({
      where: { userId: user.id },
      orderBy: { issuedAt: "desc" },
      include: { course: { select: { slug: true, category: true } } },
    }),
    prisma.enrollment.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      orderBy: { progressPercent: "desc" },
      include: {
        course: { select: { slug: true, title: true, certificateEnabled: true } },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
          Your record
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-900">
          Certificates
        </h1>
        <p className="mt-4 text-lg text-ink-500">
          Issued on completed work — every lesson, every assessment, every assignment.
          Each one has a public verification page anyone can check.
        </p>
      </header>

      {certificates.length ? (
        <ul className="mt-10 space-y-4">
          {certificates.map((certificate) => (
            <li key={certificate.id}>
              <Card className="flex flex-wrap items-center gap-6 p-6">
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-2xl ring-1 ring-inset ring-gold-200"
                >
                  🎓
                </span>

                <div className="min-w-[16rem] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{certificate.course.category}</Badge>
                    {certificate.revokedAt ? <Badge tone="red">Revoked</Badge> : null}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-ink-900">
                    {certificate.courseTitle}
                  </h2>
                  <p className="mt-1 text-sm text-ink-400">
                    Issued {formatDate(certificate.issuedAt)} · Final score{" "}
                    {certificate.finalScore}% ·{" "}
                    <span className="font-mono">{certificate.serial}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <ButtonLink href={`/certificates/${certificate.serial}`} size="sm">
                    View & print
                  </ButtonLink>
                  <ButtonLink
                    href={`/courses/${certificate.course.slug}`}
                    size="sm"
                    variant="secondary"
                  >
                    Course
                  </ButtonLink>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No certificates yet"
            description="Finish a course — all lessons, all quizzes passed and all assignments submitted — and yours is issued automatically."
            action={<ButtonLink href="/courses">Browse the catalog</ButtonLink>}
          />
        </div>
      )}

      {inProgress.length ? (
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">
            On the way
          </h2>
          <ul className="mt-5 space-y-3">
            {inProgress.map((enrollment) => (
              <li key={enrollment.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/courses/${enrollment.course.slug}`}
                      className="font-medium text-ink-900 hover:underline"
                    >
                      {enrollment.course.title}
                    </Link>
                    <span className="text-sm text-ink-400">
                      {enrollment.progressPercent}%
                    </span>
                  </div>
                  <ProgressBar percent={enrollment.progressPercent} className="mt-3" />
                  {!enrollment.course.certificateEnabled ? (
                    <p className="mt-2 text-xs text-ink-400">
                      This course does not issue a certificate.
                    </p>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-16 rounded-2xl bg-ink-900 px-8 py-10 text-white">
        <h2 className="text-2xl font-semibold tracking-tight">
          Checking someone else&rsquo;s certificate?
        </h2>
        <p className="mt-3 max-w-xl text-ink-200">
          Every certificate carries a serial like <span className="font-mono">JIGA-2026-XXXXXX</span>.
          Enter it and you will see who it was issued to, for which course, and when.
        </p>
        <ButtonLink
          href="/certificates/verify"
          className="mt-6 bg-gold-500 text-ink-950 hover:bg-gold-400"
        >
          Verify a certificate
        </ButtonLink>
      </section>
    </div>
  );
}
