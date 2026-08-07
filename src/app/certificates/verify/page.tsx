import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Alert, Button, Card, Field, inputClass } from "@/components/ui";

export const metadata: Metadata = {
  title: "Verify a certificate",
  description:
    "Check that a JI Global Academy certificate is genuine: who it was issued to, for " +
    "which course, and when.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ serial?: string }>;
}) {
  const { serial } = await searchParams;
  const query = serial?.trim().toUpperCase();

  const certificate = query
    ? await prisma.certificate.findUnique({
        where: { serial: query },
        include: { course: { select: { title: true, category: true } } },
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">
        Verify a certificate
      </h1>
      <p className="mt-4 text-lg text-ink-500">
        Enter the certificate number printed at the bottom of the certificate. It looks
        like <span className="font-mono text-ink-700">JIGA-2026-K7M4PQ</span>.
      </p>

      <Card className="mt-8 p-7">
        {/* A GET form: the result is a shareable, linkable URL. */}
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[16rem] flex-1">
            <Field label="Certificate number">
              <input
                name="serial"
                defaultValue={query ?? ""}
                required
                autoComplete="off"
                spellCheck={false}
                placeholder="JIGA-2026-K7M4PQ"
                className={`${inputClass} font-mono uppercase`}
              />
            </Field>
          </div>
          <Button type="submit" size="lg">
            Verify
          </Button>
        </form>
      </Card>

      {query ? (
        <div className="mt-8">
          {certificate ? (
            certificate.revokedAt ? (
              <Alert tone="error" title="This certificate has been revoked">
                It was issued to {certificate.recipientName} on{" "}
                {formatDate(certificate.issuedAt)} and revoked on{" "}
                {formatDate(certificate.revokedAt)}. It should not be relied upon.
              </Alert>
            ) : (
              <Card className="border-l-4 border-l-moss-500 p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-moss-600">
                  Genuine certificate
                </p>

                <dl className="mt-5 space-y-4">
                  <Row label="Issued to" value={certificate.recipientName} />
                  <Row label="Course" value={certificate.courseTitle} />
                  <Row label="Category" value={certificate.course.category} />
                  <Row label="Issued" value={formatDate(certificate.issuedAt)} />
                  <Row label="Final score" value={`${certificate.finalScore}%`} />
                  <Row label="Certificate number" value={certificate.serial} mono />
                </dl>

                <p className="mt-6 border-t border-sand-200 pt-5 text-sm text-ink-500">
                  Issued by JI Global Academy on completion of every lesson, all
                  assessments and all required assignments.{" "}
                  <Link
                    href={`/certificates/${certificate.serial}`}
                    className="font-medium text-ink-800 underline underline-offset-4"
                  >
                    View the certificate
                  </Link>
                </p>
              </Card>
            )
          ) : (
            <Alert tone="error" title="No certificate with that number">
              Check for typos — the number has no letter O, letter I, digit zero or digit
              one in it, so those are the usual culprits.
            </Alert>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <dt className="w-40 shrink-0 text-sm text-ink-400">{label}</dt>
      <dd className={mono ? "font-mono font-medium text-ink-900" : "font-medium text-ink-900"}>
        {value}
      </dd>
    </div>
  );
}
