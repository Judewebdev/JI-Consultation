"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/session";

export type AuthState = { error?: string; fieldErrors?: Record<string, string> };

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please give your full name").max(80),
  email: z.string().trim().toLowerCase().email("That does not look like an email address"),
  password: z
    .string()
    .min(10, "Use at least 10 characters — this protects your certificates too")
    .max(200),
  headline: z.string().trim().max(120).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter your email address"),
  password: z.string().min(1, "Enter your password"),
});

function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    headline: formData.get("headline"),
    country: formData.get("country"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const { name, email, password, headline, country } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { fieldErrors: { email: "There is already an account with that email address." } };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      headline: headline || null,
      country: country || null,
    },
  });

  // Everyone starts in the free orientation course. It is how new learners
  // find out how the platform works, and it means the dashboard is never empty.
  const orientation = await prisma.course.findFirst({
    where: { slug: "academy-orientation", published: true },
    select: { id: true },
  });
  if (orientation) {
    await prisma.enrollment.create({
      data: { userId: user.id, courseId: orientation.id },
    });
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // One message for both "no such user" and "wrong password", so the form
  // cannot be used to find out which email addresses have accounts.
  const failure: AuthState = { error: "Email address or password is incorrect." };
  if (!user) {
    // Still spend the time a real comparison would, so response timing does
    // not leak whether the account exists.
    await verifyPassword(parsed.data.password, "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
    return failure;
  }
  if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return failure;
  }

  await createSession(user.id);

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/") ? next : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
