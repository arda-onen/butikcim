import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_COOKIE_NAME, verifyCustomerSessionToken } from "@/lib/customer-auth";

export function getCustomerFromRequest(request: NextRequest) {
  const token = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
  return verifyCustomerSessionToken(token);
}

export function redirectToCustomerLogin(request: NextRequest, returnPath: string) {
  const login = new URL("/giris-yap", request.url);
  login.searchParams.set("returnTo", returnPath);
  login.searchParams.set("notice", "uye");
  return NextResponse.redirect(login, 302);
}
