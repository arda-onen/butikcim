import { NextResponse } from "next/server";
import { safeAuthReturnTo } from "@/lib/auth-redirect";
import { CUSTOMER_COOKIE_NAME } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const returnTo = safeAuthReturnTo(request.url, String(formData.get("returnTo") ?? "/"));
  const target = new URL(returnTo, request.url);
  const response = NextResponse.redirect(target, 302);
  response.cookies.set({
    name: CUSTOMER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
