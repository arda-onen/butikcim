import { NextResponse } from "next/server";
import { safeAuthReturnTo } from "@/lib/auth-redirect";
import { getClientIp } from "@/lib/client-ip";
import {
  assertStrongUserSessionSecretInProduction,
  createCustomerSessionToken,
  CUSTOMER_COOKIE_NAME,
  getCustomerSessionTtlSeconds,
  isValidCustomerEmail,
  verifyPassword,
} from "@/lib/customer-auth";
import {
  checkLoginAllowed,
  clearFailedAttempts,
  recordFailedAttempt,
} from "@/lib/login-rate-limit";
import { prisma } from "@/lib/prisma";

const RATE_NS = "customer-login";

export async function POST(request: Request) {
  const formData = await request.formData();
  const emailRaw = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const returnTo = safeAuthReturnTo(request.url, String(formData.get("returnTo") ?? ""));
  const ip = getClientIp(request);

  const loginUrl = new URL("/giris-yap", request.url);
  loginUrl.searchParams.set("error", "1");
  loginUrl.searchParams.set("returnTo", returnTo);

  const rateLimit = checkLoginAllowed(ip, RATE_NS);
  if (!rateLimit.allowed) {
    const blockedUrl = new URL("/giris-yap", request.url);
    blockedUrl.searchParams.set("error", "rate");
    blockedUrl.searchParams.set("retry", String(rateLimit.retryAfterSeconds));
    blockedUrl.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(blockedUrl, 302);
  }

  if (!isValidCustomerEmail(emailRaw)) {
    recordFailedAttempt(ip, RATE_NS);
    return NextResponse.redirect(loginUrl, 302);
  }

  const user = await prisma.user.findUnique({
    where: { email: emailRaw },
    select: { id: true, email: true, passwordHash: true },
  });

  const ok =
    user !== null && (await verifyPassword(password, user.passwordHash));

  if (!ok) {
    recordFailedAttempt(ip, RATE_NS);
    return NextResponse.redirect(loginUrl, 302);
  }

  clearFailedAttempts(ip, RATE_NS);

  if (process.env.NODE_ENV === "production") {
    assertStrongUserSessionSecretInProduction();
  }

  const token = createCustomerSessionToken(user.id, user.email);
  const target = new URL(returnTo, request.url);
  const response = NextResponse.redirect(target, 302);
  response.cookies.set({
    name: CUSTOMER_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getCustomerSessionTtlSeconds(),
  });

  return response;
}
