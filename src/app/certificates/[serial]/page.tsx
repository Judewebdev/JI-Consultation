import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Alert, ButtonLink } from "@/components/ui";
import { CertificateSheet } from "@/components/certificate-sheet";
import { PrintButton } from "@/components/print-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serial: string }>;
}): Promise<Metadata> {
  const { serial } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { serial: serial.toUpperCase() },
    select: { recipientName: true, courseTitle: true },
  });

  if (!certificate) return { title: "Certificate not found" };
  return {
    title: `${certificate.recipientName} — ${certificate.courseTitle}`,
    description: `Certificate of completion issued by JI Global Academy to ${certificate.recipientName}.`,
  };
}

/**
 * Public on purpose: a certificate that cannot be checked by the person you
 * showed it to is not worth issuing. Only the fields printed on the
 * certificate are exposed — never the holder's email or their coursework.
 */
export default async function CertificatePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { serial: serial.toUpperCase() },
    include: { course: { select: { slug: true } } },
  });
  if (!certificate) notFound();

  const user = await getCurrentUser();
  const isOwner = user?.id === certificate.userId;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="no-print">
        <nav className="text-sm text-ink-400">
          <Link href="/certificates/verify" className="hover:text-ink-700">
            Certificate verification
          </Link>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
              {isOwner ? "Your certificate" : "Certificate"}
            </h1>
            <p className="mt-2 text-ink-500">
              Verified against the academy record on this page load.
            </p>
          </div>
          <div className="flex gap-2">
            <PrintButton />
            <ButtonLink
              href={`/courses/${certificate.course.slug}`}
              variant="secondary"
            >
              View the course
            </ButtonLink>
          </div>
        </div>

        {certificate.revokedAt ? (
          <div className="mt-6">
            <Alert tone="error" title="This certificate has been revoked">
              It should not be relied upon as evidence of completion.
            </Alert>
          </div>
        ) : null}
      </div>

      <div className="mt-10">
        <CertificateSheet
          serial={certificate.serial}
          recipientName={certificate.recipientName}
          courseTitle={certificate.courseTitle}
          issuedAt={certificate.issuedAt}
          finalScore={certificate.finalScore}
          revoked={Boolean(certificate.revokedAt)}
        />
      </div>

      <p className="no-print mx-auto mt-10 max-w-2xl text-center text-sm text-ink-400">
        Anyone can check this certificate at{" "}
        <Link
          href={`/certificates/verify?serial=${certificate.serial}`}
          className="underline underline-offset-4 hover:text-ink-700"
        >
          the verification page
        </Link>{" "}
        using the number <span className="font-mono">{certificate.serial}</span>.
      </p>
    </div>
  );
}
