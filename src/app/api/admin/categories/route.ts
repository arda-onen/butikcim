import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { toImageDataUrl } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_REDIRECT_PREFIXES = [
  "/admin/panel",
  "/admin/urunler",
  "/admin/kategoriler",
] as const;

function sanitizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
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
  const redirectPath = resolveRedirectPath(formData.get("redirectTo"), "/admin/kategoriler");
  const name = sanitizeText(formData.get("name"));
  const image = formData.get("image");

  if (!name) {
    return NextResponse.redirect(new URL(`${redirectPath}?error=category_form`, request.url), 302);
  }

  let imageUrl: string | null = null;
  if (image && image instanceof File && image.size > 0) {
    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.redirect(new URL(`${redirectPath}?error=category_size`, request.url), 302);
    }

    imageUrl = await toImageDataUrl(image);
    if (!imageUrl) {
      return NextResponse.redirect(new URL(`${redirectPath}?error=category_form`, request.url), 302);
    }
  }

  try {
    await prisma.category.create({ data: { name, imageUrl } });
    return NextResponse.redirect(new URL(`${redirectPath}?category_created=1`, request.url), 302);
  } catch {
    return NextResponse.redirect(new URL(`${redirectPath}?error=category_exists`, request.url), 302);
  }
}
