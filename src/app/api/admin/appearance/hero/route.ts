import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { upsertHeroImageUrl } from "@/lib/site-settings";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 6 * 1024 * 1024;

function getFileExtension(fileName: string) {
  const ext = path.extname(fileName || "").toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    return ext;
  }
  return ".jpg";
}

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

  const ext = getFileExtension(image.name);
  const fileName = `${Date.now()}-${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "hero");
  const uploadPath = path.join(uploadDir, fileName);
  const bytes = await image.arrayBuffer();
  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, Buffer.from(bytes));
  const heroImageUrl = `/uploads/hero/${fileName}`;

  await upsertHeroImageUrl(heroImageUrl);

  return NextResponse.redirect(new URL("/admin/panel?hero_updated=1", request.url), 302);
}
