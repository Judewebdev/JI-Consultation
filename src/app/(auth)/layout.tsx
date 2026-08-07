import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:gap-20 lg:py-24">
      <div className="w-full max-w-md">{children}</div>

      <aside className="hidden flex-1 lg:block">
        <div className="rounded-2xl bg-ink-900 p-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
            What you get
          </p>
          <ul className="mt-6 space-y-5 text-sm leading-relaxed text-ink-200">
            <li>
              <span className="block font-semibold text-white">
                A working pack with every lesson
              </span>
              PDF notes, checklists, templates, SOPs, worksheets, prompt libraries and
              practice drills — built to be open while you work.
            </li>
            <li>
              <span className="block font-semibold text-white">
                Assignments against your own business
              </span>
              Marked by faculty, with feedback that pushes on the parts you glossed over.
            </li>
            <li>
              <span className="block font-semibold text-white">
                Certificates anyone can verify
              </span>
              Issued on completed work, with a public verification page for every serial.
            </li>
            <li>
              <span className="block font-semibold text-white">A community that answers</span>
              Specific questions, real numbers, and people who will disagree with you
              usefully.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
