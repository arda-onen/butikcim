import { Navbar } from "@/components/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-[1320px] space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
        <section className="fade-in-up mag-card rounded-[2rem] p-6 sm:p-10">
          <p className="mag-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6581]">
            Butikcim Woman
          </p>
          <h1 className="mag-heading mt-3 text-3xl font-bold text-zinc-900 sm:text-5xl">
            İletişim
          </h1>
          <p className="mt-4 max-w-3xl text-base text-[#5f5368] sm:text-lg">
            Ürün, sipariş veya iş birliği konularında bize ulaşabilirsin. Ekibimiz en kısa sürede
            geri dönüş sağlar.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="fade-in-up mag-card rounded-3xl p-5 sm:p-6">
            <h2 className="mag-heading text-2xl font-bold text-zinc-900">İletişim Bilgileri</h2>
            <div className="mt-5 space-y-4 text-sm text-zinc-600">
              <div className="rounded-2xl border border-zinc-100 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  E-posta
                </p>
                <p className="mt-1 font-semibold text-zinc-900">destek@butikcim.com</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Telefon
                </p>
                <p className="mt-1 font-semibold text-zinc-900">+90 850 000 00 00</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Çalışma Saatleri
                </p>
                <p className="mt-1 font-semibold text-zinc-900">Pazartesi - Cumartesi / 09:00 - 19:00</p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Adres
                </p>
                <p className="mt-1 font-semibold text-zinc-900">İstanbul, Türkiye</p>
              </div>
            </div>
          </article>

          <article className="fade-in-up mag-card rounded-3xl p-5 sm:p-6">
            <h2 className="mag-heading text-2xl font-bold text-zinc-900">Mesaj Gönder</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Formu doldur, ekibimiz en kısa sürede sana dönüş yapsın.
            </p>

            <form className="mt-5 grid gap-3">
              <label className="text-sm font-medium text-zinc-700">
                Ad Soyad
                <input
                  type="text"
                  placeholder="Adını ve soyadını yaz"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                />
              </label>
              <label className="text-sm font-medium text-zinc-700">
                E-posta
                <input
                  type="email"
                  placeholder="ornek@mail.com"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                />
              </label>
              <label className="text-sm font-medium text-zinc-700">
                Konu
                <input
                  type="text"
                  placeholder="Kısaca konu başlığı"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                />
              </label>
              <label className="text-sm font-medium text-zinc-700">
                Mesaj
                <textarea
                  rows={5}
                  placeholder="Mesajını yaz..."
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                />
              </label>
              <button
                type="button"
                className="ui-click mt-1 rounded-xl bg-[#2f1931] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b54486]"
              >
                Mesajı Gönder
              </button>
            </form>
          </article>
        </section>
      </main>
    </div>
  );
}
