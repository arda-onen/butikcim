import { NextRequest, NextResponse } from "next/server";
import { CART_COOKIE_NAME, parseCartCookie, serializeCartCookie } from "@/lib/cart";
import { sanitizeCartItems } from "@/lib/cart-cleanup";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const parsedCart = parseCartCookie(request.cookies.get(CART_COOKIE_NAME)?.value);
  const cartItems = await sanitizeCartItems(parsedCart);

  function redirectWithCart(url: URL, items = cartItems) {
    const response = NextResponse.redirect(url, 302);
    response.cookies.set({
      name: CART_COOKIE_NAME,
      value: serializeCartCookie(items),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: items.length > 0 ? 60 * 60 * 24 * 14 : 0,
    });
    return response;
  }

  if (!isValidEmail(email)) {
    return redirectWithCart(new URL("/sepetim?error=email", request.url));
  }

  if (cartItems.length === 0) {
    return redirectWithCart(new URL("/sepetim?error=empty", request.url), []);
  }

  const easygoResponse = await fetch(new URL("/api/easygo/checkout", request.url), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  const data = (await easygoResponse.json()) as {
    ok?: boolean;
    checkoutUrl?: string;
  };

  if (!easygoResponse.ok || !data.ok || !data.checkoutUrl) {
    return redirectWithCart(new URL("/sepetim?error=checkout", request.url));
  }

  return redirectWithCart(new URL(data.checkoutUrl, request.url), []);
}
