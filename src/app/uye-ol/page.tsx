import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CUSTOMER_COOKIE_NAME, verifyCustomerSessionToken } from "@/lib/customer-auth";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    reason?: string;
    retry?: string;
    returnTo?: string;
  }>;
}) {
  const cookieStore = await cookies();
  const session = verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE_NAME)?.value);
  if (session) {
    redirect("/");
  }

  const { error, reason, retry, returnTo } = await searchParams;
  const safeReturn = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
        <section className="fade-in-up mag-card grid w-full max-w-5xl gap-6 rounded-[2rem] p-6 md:grid-cols-2 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#54214a] via-[#7b3267] to-[#9f4f7b] p-7 text-white">
            <p className="mag-heading text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
              Butikcim Üyelik
            </p>
            <h1 className="mag-heading mt-2 text-4xl font-bold">Üye Ol</h1>
            <p className="mt-4 text-sm text-white/90">
              Ücretsiz hesap oluştur; sepet ve ödeme adımları yalnızca giriş yapmış
              üyeler için açıktır. Şifren bcrypt ile hash&apos;lenir, oturum çerezi
              httpOnly ve imzalidir.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/95">
              <li>- Şifre: en az 8 karakter, harf + rakam</li>
              <li>- Çoklu hatalı denemede geçici kilitleme</li>
              <li>- Güvenli çıkış ile çerez silinir</li>
            </ul>
          </div>

          <form
            className="space-y-4 rounded-3xl border border-white/90 bg-white/85 p-6 shadow-xl"
            method="post"
            action="/api/auth/register"
          >
            <input type="hidden" name="returnTo" value={safeReturn} />
            <h2 className="mag-heading text-3xl font-bold text-zinc-900">Hesap Oluştur</h2>
            <p className="text-sm text-zinc-600">
              Zaten hesabın var mı?{" "}
              <Link
                href={
                  safeReturn !== "/"
                    ? `/giris-yap?returnTo=${encodeURIComponent(safeReturn)}`
                    : "/giris-yap"
                }
                className="font-semibold text-[#b54486] hover:underline"
              >
                Giriş yap
              </Link>
            </p>
            {error === "rate" ? (
              <div className="ui-alert ui-alert-warn">
                Çok fazla deneme yapıldı. Yaklaşık {retry ?? "900"} saniye sonra tekrar
                dene.
              </div>
            ) : null}
            {error === "duplicate" ? (
              <div className="ui-alert ui-alert-error">
                Bu e-posta ile zaten kayıtlı bir hesap var. Giriş yapmayı dene.
              </div>
            ) : null}
            {error && error !== "rate" && error !== "duplicate" ? (
              <div className="ui-alert ui-alert-error">
                {reason === "email"
                  ? "Geçerli bir e-posta gir."
                  : reason === "password"
                    ? "Şifre en az 8 karakter olmalı; en az bir harf ve bir rakam içermeli."
                    : "Kayıt sırasında bir sorun oluştu. Tekrar dene."}
              </div>
            ) : null}
            <label className="block space-y-2 text-sm font-medium text-zinc-700">
              E-posta
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 transition focus:ring"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-zinc-700">
              Şifre
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 transition focus:ring"
              />
            </label>
            <button
              type="submit"
              className="ui-click inline-flex w-full items-center justify-center rounded-xl bg-[#2f1931] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b54486]"
            >
              Üye Ol ve Devam Et
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
