import { NextRequest, NextResponse } from "next/server";
import {
  CART_COOKIE_NAME,
  parseCartCookie,
  serializeCartCookie,
  upsertCartItem,
} from "@/lib/cart";
import { sanitizeCartItems } from "@/lib/cart-cleanup";
import { prisma } from "@/lib/prisma";
import { getCustomerFromRequest, redirectToCustomerLogin } from "@/lib/require-customer";

function parsePositiveInt(value: FormDataEntryValue | null) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    return null;
  }
  return Math.round(num);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const productId = parsePositiveInt(formData.get("productId"));
  const action = String(formData.get("action") ?? "");

  const customer = getCustomerFromRequest(request);
  if (!customer) {
    return redirectToCustomerLogin(request, "/sepetim");
  }

  if (!productId) {
    return NextResponse.redirect(new URL("/sepetim", request.url), 302);
  }

  const current = parseCartCookie(request.cookies.get(CART_COOKIE_NAME)?.value);
  const cleanedCurrent = await sanitizeCartItems(current);
  let next = cleanedCurrent;
  const productExists = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (action === "inc") {
    if (productExists) {
      next = upsertCartItem(cleanedCurrent, productId, 1);
    }
  } else if (action === "dec") {
    next = upsertCartItem(cleanedCurrent, productId, -1);
  } else if (action === "remove") {
    next = cleanedCurrent.filter((item) => item.productId !== productId);
  }

  const response = NextResponse.redirect(new URL("/sepetim", request.url), 302);
  response.cookies.set({
    name: CART_COOKIE_NAME,
    value: serializeCartCookie(next),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
