// Authentication for the single-owner admin.
// - Password is verified server-side against ADMIN_PASSWORD_HASH (bcrypt) if set,
//   otherwise against ADMIN_PASSWORD (plaintext env, fine for a single-owner setup),
//   otherwise a dev default so the preview works out of the box.
// - On success we issue a signed JWT stored in an httpOnly, secure cookie.
// - Middleware verifies the cookie for every /admin and /api/admin request.
//
// This is completely separate from the GitHub content storage.

import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE = "admin_session";
const DEV_SECRET = "dev-only-insecure-secret-change-me";

function secretKey() {
  const s = process.env.AUTH_SECRET || DEV_SECRET;
  return new TextEncoder().encode(s);
}

export function getAdminUser() {
  return process.env.ADMIN_USERNAME || "admin";
}

export async function verifyPassword(password) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    // Lazy import so bcrypt is only loaded in the Node runtime (not edge).
    const bcrypt = (await import("bcryptjs")).default;
    return bcrypt.compare(password, hash);
  }
  const plain = process.env.ADMIN_PASSWORD || "admin123";
  return password === plain;
}

export async function createSession() {
  return new SignJWT({ role: "admin", user: getAdminUser() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}
