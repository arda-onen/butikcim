import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CUSTOMER_COOKIE_NAME, verifyCustomerSessionToken } from "@/lib/customer-auth";

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    retry?: string;
    returnTo?: string;
    notice?: string;
  }>;
}) {
  const cookieStore = await cookies();
  const session = verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE_NAME)?.value);
  if (session) {
    const { returnTo } = await searchParams;
    const target =
      returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
    redirect(target);
  }

  const { error, retry, returnTo, notice } = await searchParams;
  const safeReturn = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
        <section className="fade-in-up mag-card grid w-full max-w-5xl gap-6 rounded-[2rem] p-6 md:grid-cols-2 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#2f1931] via-[#4e1f43] to-[#7b3267] p-7 text-white">
            <p className="mag-heading text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
              Butikcim
            </p>
            <h1 className="mag-heading mt-2 text-4xl font-bold">Giriş Yap</h1>
            <p className="mt-4 text-sm text-white/90">
              Sepete ürün eklemek, sepetini yönetmek ve iyzico ile ödemeye geçmek için
              giriş yapmalısın.
            </p>
          </div>

          <form
            className="space-y-4 rounded-3xl border border-white/90 bg-white/85 p-6 shadow-xl"
            method="post"
            action="/api/auth/login"
          >
            <input type="hidden" name="returnTo" value={safeReturn} />
            <h2 className="mag-heading text-3xl font-bold text-zinc-900">Hesabına Gir</h2>
            {notice === "uye" ? (
              <div className="ui-alert ui-alert-warn">
                Sepet ve ödeme için üye girişi gereklidir.
              </div>
            ) : null}
            <p className="text-sm text-zinc-600">
              Hesabın yok mu?{" "}
              <Link
                href={safeReturn !== "/" ? `/uye-ol?returnTo=${encodeURIComponent(safeReturn)}` : "/uye-ol"}
                className="font-semibold text-[#b54486] hover:underline"
              >
                Üye ol
              </Link>
            </p>
            {error === "rate" ? (
              <div className="ui-alert ui-alert-warn">
                Çok fazla hatalı deneme yapıldı. Yaklaşık {retry ?? "900"} saniye sonra
                tekrar dene.
              </div>
            ) : null}
            {error && error !== "rate" ? (
              <div className="ui-alert ui-alert-error">E-posta veya şifre hatalı.</div>
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
                autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 transition focus:ring"
              />
            </label>
            <button
              type="submit"
              className="ui-click inline-flex w-full items-center justify-center rounded-xl bg-[#2f1931] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b54486]"
            >
              Giriş Yap
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
