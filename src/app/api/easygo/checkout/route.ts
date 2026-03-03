import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let email = "";

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { email?: string };
    email = String(body.email ?? "").trim().toLowerCase();
  } else {
    const formData = await request.formData();
    email = String(formData.get("email") ?? "").trim().toLowerCase();
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Gecerli bir e-posta gerekli.",
      },
      { status: 400 },
    );
  }

  // Profile/account yok: iyzico checkout sadece e-posta ile başlar.
  return NextResponse.json({
    ok: true,
    message: "iyzico ödeme oturumu hazırlandı (demo).",
    email,
    checkoutUrl: "/odeme/basarili",
  });
}
