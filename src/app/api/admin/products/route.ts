import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { toImageDataUrl } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { clampDiscountPercent } from "@/lib/pricing";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const PRODUCT_GENDER = "KADIN" as const;
const ALLOWED_REDIRECT_PREFIXES = [
  "/admin/panel",
  "/admin/urunler",
  "/admin/kategoriler",
] as const;

function sanitizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function parsePositiveNumber(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

function resolveRedirectPath(value: FormDataEntryValue | null, fallback: string) {
  const raw = String(value ?? "").trim();
  if (!raw.startsWith("/")) {
    return fallback;
  }
  if (ALLOWED_REDIRECT_PREFIXES.some((prefix) => raw.startsWith(prefix))) {
    return raw;
  }
  return fallback;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.redirect(new URL("/admin?error=auth", request.url), 302);
  }

  const formData = await request.formData();
  const redirectPath = resolveRedirectPath(formData.get("redirectTo"), "/admin/urunler");
  const name = sanitizeText(formData.get("name"));
  const categoryId = parsePositiveNumber(sanitizeText(formData.get("categoryId")));
  const badge = sanitizeText(formData.get("badge")) || null;
  const price = parsePositiveNumber(sanitizeText(formData.get("price")));
  const discountPercent =
    parsePositiveNumber(sanitizeText(formData.get("discountPercent"))) ?? 0;
  const stock = parsePositiveNumber(sanitizeText(formData.get("stock")));
  const rating =
    parsePositiveNumber(sanitizeText(formData.get("rating"))) ??
    undefined;
  const image = formData.get("image");

  if (!name || categoryId === null || price === null || stock === null) {
    return NextResponse.redirect(new URL(`${redirectPath}?error=form`, request.url), 302);
  }

  const category = await prisma.category.findUnique({
    where: { id: Math.round(categoryId) },
  });
  if (!category) {
    return NextResponse.redirect(new URL(`${redirectPath}?error=category`, request.url), 302);
  }

  let imageUrl: string | null = null;

  if (image && image instanceof File && image.size > 0) {
    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.redirect(new URL(`${redirectPath}?error=size`, request.url), 302);
    }

    imageUrl = await toImageDataUrl(image);
    if (!imageUrl) {
      return NextResponse.redirect(new URL(`${redirectPath}?error=form`, request.url), 302);
    }
  }

  await prisma.product.create({
    data: {
      name,
      gender: PRODUCT_GENDER,
      category: category.name,
      categoryId: category.id,
      badge,
      price: Math.round(price),
      discountPercent: clampDiscountPercent(discountPercent),
      stock: Math.round(stock),
      rating: rating === undefined ? 4.5 : Math.min(5, Math.max(0, rating)),
      imageUrl,
    },
  });

  return NextResponse.redirect(new URL(`${redirectPath}?created=1`, request.url), 302);
}
