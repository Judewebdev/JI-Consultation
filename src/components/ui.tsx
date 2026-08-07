import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Small shared primitives. Deliberately plain — no component library. */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950 disabled:bg-ink-300 shadow-sm",
  secondary:
    "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 disabled:text-ink-300",
  ghost: "text-ink-600 hover:text-ink-900 hover:bg-ink-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

function buttonClass(variant: Variant, size: Size, className?: string) {
  return cx(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
    "disabled:cursor-not-allowed",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={buttonClass(variant, size, className)} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={buttonClass(variant, size, className)} />;
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-[var(--radius-card)] bg-white ring-1 ring-sand-200 shadow-[0_1px_2px_rgba(11,31,58,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">{title}</h2>
        {description ? <p className="mt-2 text-ink-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Indicators
// ---------------------------------------------------------------------------

type Tone = "neutral" | "gold" | "moss" | "ink" | "red";

const TONES: Record<Tone, string> = {
  neutral: "bg-sand-100 text-ink-600 ring-sand-300",
  gold: "bg-gold-50 text-gold-700 ring-gold-200",
  moss: "bg-moss-50 text-moss-600 ring-moss-500/25",
  ink: "bg-ink-900 text-white ring-ink-900",
  red: "bg-red-50 text-red-700 ring-red-200",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  percent,
  className,
  label,
}: {
  percent: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className={className}>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-sand-200"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Course progress"}
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width] duration-500",
            clamped >= 100 ? "bg-moss-500" : "bg-ink-900",
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink-800 font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {letters}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export function Alert({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "error" | "success" | "warning";
  title?: string;
  children?: ReactNode;
}) {
  const tones = {
    neutral: "bg-ink-50 text-ink-700 ring-ink-200",
    error: "bg-red-50 text-red-800 ring-red-200",
    success: "bg-moss-50 text-moss-600 ring-moss-500/25",
    warning: "bg-gold-50 text-gold-800 ring-gold-200",
  } as const;

  return (
    <div className={cx("rounded-lg px-4 py-3 text-sm ring-1 ring-inset", tones[tone])}>
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? <div className={title ? "mt-1" : undefined}>{children}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-sand-300 bg-white/60 px-6 py-14 text-center">
      <p className="font-medium text-ink-800">{title}</p>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-red-700">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>
      ) : null}
    </label>
  );
}

export const inputClass =
  "block w-full rounded-lg border-0 bg-white px-3.5 py-2.5 text-ink-900 shadow-sm " +
  "ring-1 ring-inset ring-ink-200 placeholder:text-ink-300 " +
  "focus:ring-2 focus:ring-inset focus:ring-ink-700 focus-visible:outline-none " +
  "disabled:bg-sand-100 disabled:text-ink-400 sm:text-sm";
