import { Navbar } from "@/components/navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; retry?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (session) {
    redirect("/admin/panel");
  }

  const { error, retry } = await searchParams;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
        <section className="fade-in-up mag-card grid w-full max-w-5xl gap-6 rounded-[2rem] p-6 md:grid-cols-2 md:p-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#54214a] via-[#7b3267] to-[#9f4f7b] p-7 text-white">
            <p className="mag-heading text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
              Butikcim Yönetim
            </p>
            <h1 className="mag-heading mt-2 text-4xl font-bold">Admin Paneli</h1>
            <p className="mt-4 text-sm text-white/90">
              Tek hesapla ürün, stok ve sipariş süreçlerini kolayca yönet. Panel
              tasarımı mobil ve masaüstünde akıcı deneyim sunar.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/95">
              <li>- Ürün ekle / güncelle</li>
              <li>- Stok uyarıları</li>
              <li>- Easygo sipariş adımları</li>
            </ul>
          </div>

          <form
            className="space-y-4 rounded-3xl border border-white/90 bg-white/85 p-6 shadow-xl"
            method="post"
            action="/api/admin/login"
          >
            <h2 className="mag-heading text-3xl font-bold text-zinc-900">Giriş Yap</h2>
            <p className="text-sm text-zinc-600">
              Sadece yetkili admin hesabı giriş yapabilir. Bilgileriniz güvenli
              oturum olarak saklanır.
            </p>
            {error === "rate" ? (
              <div className="ui-alert ui-alert-warn">
                Çok fazla hatalı deneme yapıldı. Lütfen yaklaşık{" "}
                {retry ?? "900"} saniye sonra tekrar deneyin.
              </div>
            ) : null}
            {error && error !== "rate" ? (
              <div className="ui-alert ui-alert-error">
                Giriş başarısız. E-posta veya şifre hatalı.
              </div>
            ) : null}
            <label className="block space-y-2 text-sm font-medium text-zinc-700">
              E-posta
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue="admin@butikcim.com"
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
              Güvenli Giriş Yap
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
