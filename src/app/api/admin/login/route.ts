import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  getSessionTtlSeconds,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { getClientIp } from "@/lib/client-ip";
import {
  checkLoginAllowed,
  clearFailedAttempts,
  recordFailedAttempt,
} from "@/lib/login-rate-limit";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ip = getClientIp(request);

  const loginUrl = new URL("/admin?error=1", request.url);
  const panelUrl = new URL("/admin/panel", request.url);

  const rateLimit = checkLoginAllowed(ip);
  if (!rateLimit.allowed) {
    const blockedUrl = new URL("/admin?error=rate", request.url);
    blockedUrl.searchParams.set("retry", String(rateLimit.retryAfterSeconds));
    return NextResponse.redirect(blockedUrl, 302);
  }

  if (!verifyAdminCredentials(email, password)) {
    recordFailedAttempt(ip);
    return NextResponse.redirect(loginUrl, 302);
  }

  clearFailedAttempts(ip);

  const token = createSessionToken(email);
  const response = NextResponse.redirect(panelUrl, 302);
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionTtlSeconds(),
  });

  return response;
}
