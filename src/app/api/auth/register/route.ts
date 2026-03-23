import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { safeAuthReturnTo } from "@/lib/auth-redirect";
import { getClientIp } from "@/lib/client-ip";
import {
  assertStrongUserSessionSecretInProduction,
  createCustomerSessionToken,
  CUSTOMER_COOKIE_NAME,
  getCustomerSessionTtlSeconds,
  hashPassword,
  isValidCustomerEmail,
  validatePasswordPolicy,
} from "@/lib/customer-auth";
import {
  checkLoginAllowed,
  clearFailedAttempts,
  recordFailedAttempt,
} from "@/lib/login-rate-limit";
import { prisma } from "@/lib/prisma";

const RATE_NS = "customer-register";

export async function POST(request: Request) {
  const formData = await request.formData();
  const emailRaw = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const returnTo = safeAuthReturnTo(request.url, String(formData.get("returnTo") ?? ""));
  const ip = getClientIp(request);

  const failUrl = new URL("/uye-ol", request.url);
  failUrl.searchParams.set("error", "1");
  failUrl.searchParams.set("returnTo", returnTo);

  const rateLimit = checkLoginAllowed(ip, RATE_NS);
  if (!rateLimit.allowed) {
    const blockedUrl = new URL("/uye-ol", request.url);
    blockedUrl.searchParams.set("error", "rate");
    blockedUrl.searchParams.set("retry", String(rateLimit.retryAfterSeconds));
    blockedUrl.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(blockedUrl, 302);
  }

  if (!isValidCustomerEmail(emailRaw)) {
    recordFailedAttempt(ip, RATE_NS);
    failUrl.searchParams.set("reason", "email");
    return NextResponse.redirect(failUrl, 302);
  }

  const policyError = validatePasswordPolicy(password);
  if (policyError) {
    recordFailedAttempt(ip, RATE_NS);
    failUrl.searchParams.set("reason", "password");
    return NextResponse.redirect(failUrl, 302);
  }

  if (process.env.NODE_ENV === "production") {
    assertStrongUserSessionSecretInProduction();
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email: emailRaw, passwordHash },
      select: { id: true, email: true },
    });

    clearFailedAttempts(ip, RATE_NS);

    const token = createCustomerSessionToken(user.id, user.email);
    const okUrl = new URL(returnTo, request.url);
    const response = NextResponse.redirect(okUrl, 302);
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      recordFailedAttempt(ip, RATE_NS);
      const dupUrl = new URL("/uye-ol", request.url);
      dupUrl.searchParams.set("error", "duplicate");
      dupUrl.searchParams.set("returnTo", returnTo);
      return NextResponse.redirect(dupUrl, 302);
    }
    recordFailedAttempt(ip, RATE_NS);
    failUrl.searchParams.set("reason", "server");
    return NextResponse.redirect(failUrl, 302);
  }
}
