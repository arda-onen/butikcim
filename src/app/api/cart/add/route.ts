import { NextRequest, NextResponse } from "next/server";
import {
  CART_COOKIE_NAME,
  parseCartCookie,
  serializeCartCookie,
  upsertCartItem,
} from "@/lib/cart";
import { sanitizeCartItems } from "@/lib/cart-cleanup";
import { prisma } from "@/lib/prisma";

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
  const quantity = parsePositiveInt(formData.get("quantity")) ?? 1;
  const returnTo = String(formData.get("returnTo") ?? "/sepetim");

  if (!productId) {
    return NextResponse.redirect(new URL("/urunler", request.url), 302);
  }

  const current = parseCartCookie(request.cookies.get(CART_COOKIE_NAME)?.value);
  const cleanedCurrent = await sanitizeCartItems(current);
  const productExists = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!productExists) {
    const fallbackResponse = NextResponse.redirect(new URL("/urunler", request.url), 302);
    fallbackResponse.cookies.set({
      name: CART_COOKIE_NAME,
      value: serializeCartCookie(cleanedCurrent),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return fallbackResponse;
  }

  const next = upsertCartItem(cleanedCurrent, productId, quantity);

  const targetUrl = new URL(returnTo, request.url);
  targetUrl.searchParams.set("added", "1");

  const response = NextResponse.redirect(targetUrl, 302);
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
