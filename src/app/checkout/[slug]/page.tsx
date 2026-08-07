import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { env } from "@/lib/env";
import { formatPrice } from "@/lib/format";
import { Alert, Card } from "@/components/ui";
import { CheckoutButton } from "@/components/enroll-button";

export const metadata: Metadata = { title: "Checkout" };

const ERRORS: Record<string, string> = {
  declined:
    "The payment was not completed, so nothing has been charged. You can try again below.",
  verification:
    "We could not confirm the payment with the provider. If money has left your account, contact us with your order reference and we will sort it out.",
  unverified: "That checkout session expired before it was completed. Start a new one below.",
};

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; cancelled?: string }>;
}) {
  const { slug } = await params;
  const { error, cancelled } = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/checkout/${slug}`);

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { modules: true, resources: true, assignments: true } },
      modules: { select: { _count: { select: { lessons: true } } } },
    },
  });
  if (!course || !course.published) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    select: { id: true },
  });
  if (enrollment) redirect(`/courses/${course.slug}`);

  const lessonCount = course.modules.reduce((sum, m) => sum + m._count.lessons, 0);
  const provider = env.payments.provider();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav className="text-sm text-ink-400">
        <Link href={`/courses/${course.slug}`} className="hover:text-ink-700">
          ← Back to {course.title}
        </Link>
      </nav>

      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink-900">Checkout</h1>

      {error && ERRORS[error] ? (
        <div className="mt-6">
          <Alert tone="error" title="Payment not completed">
            {ERRORS[error]}
          </Alert>
        </div>
      ) : null}

      {cancelled ? (
        <div className="mt-6">
          <Alert tone="neutral" title="Checkout cancelled">
            Nothing has been charged. The course is still here whenever you are ready.
          </Alert>
        </div>
      ) : null}

      <Card className="mt-8 overflow-hidden">
        <div className="border-b border-sand-200 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
            {course.category}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
            {course.title}
          </h2>
          <p className="mt-1.5 text-ink-500">{course.subtitle}</p>
          {course.instructor ? (
            <p className="mt-4 text-sm text-ink-400">
              Taught by {course.instructor.name}
            </p>
          ) : null}
        </div>

        <div className="border-b border-sand-200 p-7">
          <h3 className="text-sm font-semibold text-ink-900">What is included</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-600">
            {[
              `${course._count.modules} modules and ${lessonCount} lessons`,
              `${course._count.resources} downloadable working documents`,
              `${course._count.assignments} assignments marked with written feedback`,
              "Module and final quizzes, retakeable",
              course.certificateEnabled
                ? "A certificate with a public verification page"
                : "Full course community access",
              "Lifetime access, including future updates",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="text-moss-500">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-7">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Course</dt>
              <dd className="text-ink-900">
                {formatPrice(course.priceCents, course.currency)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Tax</dt>
              <dd className="text-ink-400">Calculated by the payment provider</dd>
            </div>
            <div className="flex justify-between border-t border-sand-200 pt-3 text-base">
              <dt className="font-semibold text-ink-900">Total today</dt>
              <dd className="font-semibold text-ink-900">
                {formatPrice(course.priceCents, course.currency)}
              </dd>
            </div>
          </dl>

          <div className="mt-7">
            <CheckoutButton
              slug={course.slug}
              label={`Pay ${formatPrice(course.priceCents, course.currency)}`}
            />
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-ink-400">
            {provider === "mock" ? (
              <>
                This instance is running the <strong>test gateway</strong> — no card
                details are taken and no money moves. Set{" "}
                <code className="font-mono">PAYMENTS_PROVIDER</code> to{" "}
                <code className="font-mono">stripe</code> or{" "}
                <code className="font-mono">paystack</code> to take real payments.
              </>
            ) : (
              <>
                You will be taken to {provider === "stripe" ? "Stripe" : "Paystack"} to pay
                securely. We never see or store your card details.
              </>
            )}
          </p>
        </div>
      </Card>

      <p className="mt-8 text-center text-sm text-ink-400">
        Enrolment is granted only after the provider confirms the payment to our server —
        not when your browser returns from the checkout page.
      </p>
    </div>
  );
}
