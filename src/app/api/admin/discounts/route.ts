import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { clampDiscountPercent } from "@/lib/pricing";

function parsePositiveInt(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.round(parsed);
}

function parseDiscountPercent(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return clampDiscountPercent(parsed);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.redirect(new URL("/admin?error=auth", request.url), 302);
  }

  const formData = await request.formData();
  const categoryId = parsePositiveInt(formData.get("categoryId"));
  const productId = parsePositiveInt(formData.get("productId"));
  const selectedProductIds = formData
    .getAll("productIds")
    .map((value) => parsePositiveInt(value))
    .filter((value): value is number => value !== null);
  const discountPercent = parseDiscountPercent(formData.get("discountPercent"));
  const redirectTo = String(formData.get("redirectTo") ?? "/admin/indirimler");
  const safeRedirectPath = redirectTo.startsWith("/admin/indirimler")
    ? redirectTo
    : "/admin/indirimler";

  const redirectUrl = new URL(safeRedirectPath, request.url);
  if (categoryId) {
    redirectUrl.searchParams.set("discount_category", String(categoryId));
  }
  if (productId) {
    redirectUrl.searchParams.set("discount_product", String(productId));
  }

  if (discountPercent === null) {
    redirectUrl.searchParams.set("error", "discount_form");
    return NextResponse.redirect(redirectUrl, 302);
  }

  let updatedCount = 0;

  if (selectedProductIds.length > 0) {
    const updated = await prisma.product.updateMany({
      where: { id: { in: selectedProductIds } },
      data: { discountPercent },
    });
    updatedCount = updated.count;
  } else if (productId) {
    const updated = await prisma.product.updateMany({
      where: { id: productId },
      data: { discountPercent },
    });
    updatedCount = updated.count;
  } else if (categoryId) {
    const updated = await prisma.product.updateMany({
      where: { categoryId },
      data: { discountPercent },
    });
    updatedCount = updated.count;
  } else {
    redirectUrl.searchParams.set("error", "discount_target");
    return NextResponse.redirect(redirectUrl, 302);
  }

  if (updatedCount === 0) {
    redirectUrl.searchParams.set("error", "discount_empty");
    return NextResponse.redirect(redirectUrl, 302);
  }

  redirectUrl.searchParams.set("discount_updated", "1");
  redirectUrl.searchParams.set("discount_count", String(updatedCount));
  return NextResponse.redirect(redirectUrl, 302);
}
