import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/server/actions/auth";
import { Avatar, ButtonLink } from "./ui";

const NAV = [
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard", authOnly: true },
  { href: "/community", label: "Community", authOnly: true },
  { href: "/certificates", label: "Certificates", authOnly: true },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold tracking-tight text-gold-300">
            JI
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-ink-900">Global Academy</span>
            <span className="block text-[11px] text-ink-400">JI Consultation</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.filter((item) => !item.authOnly || user).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-ink-50"
              >
                <Avatar name={user.name} size={32} />
                <span className="hidden text-sm font-medium text-ink-800 sm:block">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                Sign in
              </Link>
              <ButtonLink href="/register" size="sm">
                Create account
              </ButtonLink>
            </>
          )}
        </div>
      </div>

      {/* Primary navigation collapses to a scrolling strip on small screens. */}
      <nav className="flex gap-1 overflow-x-auto border-t border-sand-200 px-4 py-2 md:hidden">
        {NAV.filter((item) => !item.authOnly || user).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-sand-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-xs font-bold text-gold-300">
              JI
            </span>
            <span className="text-sm font-semibold text-ink-900">JI Global Academy</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-ink-500">
            Practical training for owner-operators, consultants and small teams. Every
            course ends in work you can use, not a certificate you file away.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
            Learn
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li>
              <Link href="/courses" className="hover:text-ink-900">
                Course catalog
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-ink-900">
                Community
              </Link>
            </li>
            <li>
              <Link href="/certificates/verify" className="hover:text-ink-900">
                Verify a certificate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
            Account
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li>
              <Link href="/register" className="hover:text-ink-900">
                Create an account
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-ink-900">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-ink-900">
                Your dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand-200">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-400 sm:px-6">
          © {new Date().getFullYear()} JI Consultation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
