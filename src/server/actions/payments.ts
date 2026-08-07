"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { env } from "@/lib/env";
import { getGateway } from "@/lib/payments";

export type CheckoutState = { error?: string };

/**
 * Creates an order and hands the learner to the payment provider.
 *
 * The price comes from the database, never from the form — the only thing the
 * browser gets to choose is which course.
 */
export async function startCheckoutAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");

  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, priceCents: true, currency: true, published: true },
  });
  if (!course || !course.published) return { error: "That course is not available." };

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    select: { id: true },
  });
  if (existing) redirect(`/courses/${course.slug}`);

  if (course.priceCents === 0) {
    await prisma.enrollment.create({ data: { userId: user.id, courseId: course.id } });
    redirect(`/courses/${course.slug}`);
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      courseId: course.id,
      provider: env.payments.provider(),
      amountCents: course.priceCents,
      currency: course.currency,
      status: "PENDING",
    },
  });

  const gateway = getGateway();
  let redirectUrl: string;

  try {
    const session = await gateway.createCheckout({
      orderId: order.id,
      amountCents: course.priceCents,
      currency: course.currency,
      courseTitle: course.title,
      courseSlug: course.slug,
      customerEmail: user.email,
      successUrl: `${env.appUrl()}/api/payments/confirm?order=${order.id}`,
      cancelUrl: `${env.appUrl()}/checkout/${course.slug}?cancelled=1`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { providerRef: session.providerRef },
    });
    redirectUrl = session.redirectUrl;
  } catch (error) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    console.error("Checkout could not be started", error);
    return {
      error:
        "We could not reach the payment provider. Nothing has been charged — please try again.",
    };
  }

  redirect(redirectUrl);
}
