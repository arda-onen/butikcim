import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export const CUSTOMER_COOKIE_NAME = "butikcim_customer_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
const BCRYPT_ROUNDS = 12;

type CustomerSessionPayload = {
  sub: number;
  email: string;
  exp: number;
};

function getSessionSecret() {
  return process.env.USER_SESSION_SECRET ?? "dev-only-change-user-session-secret";
}

export function assertStrongUserSessionSecretInProduction() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  const s = process.env.USER_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "USER_SESSION_SECRET must be set to a random string of at least 32 characters in production.",
    );
  }
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signPayload(payloadB64: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");
}

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function createCustomerSessionToken(userId: number, email: string) {
  const payload: CustomerSessionPayload = {
    sub: userId,
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

export function verifyCustomerSessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payloadB64);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as CustomerSessionPayload;
    if (
      typeof payload.sub !== "number" ||
      typeof payload.email !== "string" ||
      !payload.exp ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function getCustomerSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}

export function isValidCustomerEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Returns error message in Turkish or null if OK */
export function validatePasswordPolicy(password: string) {
  if (password.length < 8) {
    return "Şifre en az 8 karakter olmalıdır.";
  }
  if (password.length > 128) {
    return "Şifre çok uzun.";
  }
  if (!/\p{L}/u.test(password)) {
    return "Şifre en az bir harf içermelidir.";
  }
  if (!/\p{N}/u.test(password)) {
    return "Şifre en az bir rakam içermelidir.";
  }
  return null;
}
