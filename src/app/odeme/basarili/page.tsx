import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8fb] via-[#f7f7f7] to-[#f3f3f6]">
      <Navbar />
      <main className="mx-auto w-full max-w-[900px] px-4 py-12 sm:px-6 sm:py-16">
        <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Iyzico
          </p>
          <h1 className="mt-2 text-2xl font-black text-zinc-900 sm:text-3xl">Ödeme başarılı</h1>
          <p className="mt-3 text-sm text-zinc-600">
            Siparişin alındı. E-posta adresine sipariş detaylarını gönderiyoruz.
          </p>
          <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
            <Link
              href="/"
              className="ui-click rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/urunler"
              className="ui-click rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
