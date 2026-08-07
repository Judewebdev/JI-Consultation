import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { env } from "@/lib/env";
import { getGateway } from "@/lib/payments";

/**
 * Where providers send the learner after payment.
 *
 * The redirect itself proves nothing — anyone can visit this URL. Access is
 * granted only after the gateway confirms the charge server-to-server, and
 * only when the confirmed amount matches what we asked for.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order");

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", env.appUrl()));
  }
  if (!orderId) {
    return NextResponse.redirect(new URL("/dashboard", env.appUrl()));
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { course: { select: { slug: true, id: true } } },
  });

  if (!order || order.userId !== user.id) {
    return NextResponse.redirect(new URL("/dashboard", env.appUrl()));
  }

  const courseUrl = new URL(`/courses/${order.course.slug}`, env.appUrl());
  const checkoutUrl = new URL(`/checkout/${order.course.slug}`, env.appUrl());

  // Already processed — replaying the redirect must not double-enrol.
  if (order.status === "PAID") {
    return NextResponse.redirect(courseUrl);
  }

  if (!order.providerRef) {
    checkoutUrl.searchParams.set("error", "unverified");
    return NextResponse.redirect(checkoutUrl);
  }

  let verification;
  try {
    verification = await getGateway().verify(order.providerRef);
  } catch (error) {
    console.error("Payment verification failed", error);
    checkoutUrl.searchParams.set("error", "verification");
    return NextResponse.redirect(checkoutUrl);
  }

  // Guard against a session that was completed for a different amount.
  const amountMatches =
    verification.amountCents === undefined || verification.amountCents === order.amountCents;

  if (!verification.paid || !amountMatches) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    checkoutUrl.searchParams.set("error", "declined");
    return NextResponse.redirect(checkoutUrl);
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date() },
    }),
    prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: order.course.id } },
      create: { userId: user.id, courseId: order.course.id },
      update: { status: "ACTIVE", lastAccessedAt: new Date() },
    }),
  ]);

  courseUrl.searchParams.set("welcome", "1");
  return NextResponse.redirect(courseUrl);
}
