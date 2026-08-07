import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

import { env } from "./env";
import { prisma } from "./prisma";
import type { Role } from "./enums";

const COOKIE_NAME = "jiga_session";
const SESSION_DAYS = 30;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

function secretKey() {
  return new TextEncoder().encode(env.sessionSecret());
}

// ---------------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------------

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ---------------------------------------------------------------------------
// Session cookie
// ---------------------------------------------------------------------------

export async function createSession(userId: string): Promise<void> {
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("ji-global-academy")
    .setExpirationTime(expires)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
    expires,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

async function readUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: "ji-global-academy",
    });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    // Expired or tampered-with cookie — treat as signed out.
    return null;
  }
}

/** The signed-in user, or null. Safe to call from any server component. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const userId = await readUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) return null;

  return { ...user, role: user.role as Role };
}

/**
 * Like getCurrentUser but throws when signed out. Use in server actions and
 * route handlers, where the caller has already passed a UI-level guard and an
 * anonymous request means something is wrong.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function requireStaff(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
    throw new Error("Not authorised");
  }
  return user;
}
