import { formatDate } from "@/lib/format";

/**
 * The certificate itself. Styled to print cleanly to A4 landscape (see the
 * print rules in globals.css) so "save as PDF" from the browser produces
 * something a learner is willing to attach to an email.
 */
export function CertificateSheet({
  serial,
  recipientName,
  courseTitle,
  issuedAt,
  finalScore,
  revoked = false,
}: {
  serial: string;
  recipientName: string;
  courseTitle: string;
  issuedAt: Date | string;
  finalScore: number;
  revoked?: boolean;
}) {
  return (
    <div className="certificate-sheet relative mx-auto max-w-4xl border-8 border-ink-900 bg-white px-8 py-12 shadow-lg sm:px-16 sm:py-16">
      <div className="pointer-events-none absolute inset-3 border border-gold-300" aria-hidden />

      {revoked ? (
        <p
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-6xl font-bold uppercase tracking-widest text-red-500/15"
        >
          Revoked
        </p>
      ) : null}

      <div className="relative text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold text-gold-300">
            JI
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-ink-900">
              JI Global Academy
            </span>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-400">
              JI Consultation
            </span>
          </span>
        </div>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
          Certificate of Completion
        </p>

        <p className="mt-8 text-sm text-ink-400">This is to certify that</p>
        <p className="mt-3 font-serif text-4xl tracking-tight text-ink-900 sm:text-5xl">
          {recipientName}
        </p>

        <p className="mt-8 text-sm text-ink-400">has successfully completed</p>
        <p className="mx-auto mt-3 max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-3xl">
          {courseTitle}
        </p>

        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ink-500">
          Completing every lesson, passing all assessments and submitting the required
          assignments applied to their own business.
        </p>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-sand-300 pt-6 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink-400">Issued</p>
            <p className="mt-1 text-sm font-semibold text-ink-900">{formatDate(issuedAt)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink-400">
              Final score
            </p>
            <p className="mt-1 text-sm font-semibold text-ink-900">{finalScore}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink-400">
              Certificate no.
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-ink-900">{serial}</p>
          </div>
        </div>

        <p className="mt-8 text-[11px] text-ink-400">
          Verify this certificate at jiglobalacademy.com/certificates/{serial}
        </p>
      </div>
    </div>
  );
}
