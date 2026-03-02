import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1320px] items-center px-4 py-16 sm:px-6">
        <section className="fade-in-up mag-card w-full rounded-[2rem] p-8 text-center sm:p-12">
          <p className="mag-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6581]">
            Hata 404
          </p>
          <h1 className="mag-heading mt-3 text-4xl font-bold text-zinc-900 sm:text-5xl">
            Aradığın sayfa bulunamadı
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-600 sm:text-base">
            Bu bağlantı kaldırılmış, taşınmış veya yanlış yazılmış olabilir.
            Ana sayfaya dönerek koleksiyonları keşfetmeye devam edebilirsin.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="ui-click rounded-xl bg-[#2f1931] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-[#b54486]"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/urunler"
              className="ui-click rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
            >
              Koleksiyona Git
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
