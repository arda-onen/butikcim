import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { toImageDataUrl } from "@/lib/image-upload";
import { upsertHeroImageUrl } from "@/lib/site-settings";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 6 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.redirect(new URL("/admin?error=auth", request.url), 302);
  }

  const formData = await request.formData();
  const image = formData.get("heroImage");

  if (!image || !(image instanceof File) || image.size <= 0) {
    return NextResponse.redirect(new URL("/admin/panel?error=hero_form", request.url), 302);
  }

  if (image.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.redirect(new URL("/admin/panel?error=hero_size", request.url), 302);
  }

  const heroImageUrl = await toImageDataUrl(image);
  if (!heroImageUrl) {
    return NextResponse.redirect(new URL("/admin/panel?error=hero_form", request.url), 302);
  }

  await upsertHeroImageUrl(heroImageUrl);

  return NextResponse.redirect(new URL("/admin/panel?hero_updated=1", request.url), 302);
}
