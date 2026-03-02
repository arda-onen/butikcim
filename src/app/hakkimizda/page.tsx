import Link from "next/link";
import { Navbar } from "@/components/navbar";

const values = [
  {
    title: "Editöryel Seçki",
    text: "Her koleksiyonu trend raporları ve gerçek müşteri ihtiyaçlarıyla şekillendiriyoruz.",
  },
  {
    title: "Premium Deneyim",
    text: "Vitrin dilinden ödeme akışına kadar tüm adımları sade, hızlı ve zarif tasarlıyoruz.",
  },
  {
    title: "Kadın Odaklı Stil",
    text: "Butikcim yalnızca kadın koleksiyonuna odaklanır ve her sezonda güçlü bir stil sunar.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-[1320px] space-y-8 px-4 py-10 sm:px-6">
        <section className="fade-in-up mag-card rounded-[2rem] p-8 sm:p-10">
          <p className="mag-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6581]">
            Butikcim Woman
          </p>
          <h1 className="mag-heading mt-3 text-4xl font-bold text-zinc-900 sm:text-5xl">
            Hakkımızda
          </h1>
          <p className="mt-4 max-w-3xl text-base text-[#5f5368] sm:text-lg">
            Butikcim, kadın modasını güçlü bir editöryel bakışla sunan dijital butik markasıdır.
            Amacımız yalnızca ürün satmak değil; stil ilhamı veren, güvenli ödeme sunan ve
            premium hissettiren bir deneyim oluşturmaktır.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/urunler"
              className="ui-click rounded-xl bg-[#2f1931] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-[#b54486]"
            >
              Koleksiyonu Keşfet
            </Link>
            <Link
              href="/iletisim"
              className="ui-click rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
            >
              Bizimle İletişime Geç
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="fade-in-up mag-card rounded-2xl p-5">
              <h2 className="mag-heading text-xl font-bold text-zinc-900">{value.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{value.text}</p>
            </article>
          ))}
        </section>

        <section className="fade-in-up mag-card rounded-3xl p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mag-heading text-sm font-semibold uppercase tracking-[0.16em] text-[#b54486]">
                Marka Yolculuğu
              </p>
              <h2 className="mag-heading mt-2 text-3xl font-bold text-zinc-900">
                Trendy ve premium arasında güçlü denge
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                Koleksiyonlarımız sezon trendlerini takip ederken zamansız parçaları da korur.
                Bu sayede hem günlük stile hem özel davet kombinlerine uygun bir vitrin sunarız.
                Tasarım dilimizde yumuşak lüks, canlı detaylar ve modern kadın enerjisi bir arada
                yer alır.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <StatBadge label="Aktif Kategori" value="10+" />
              <StatBadge label="Mutlu Müşteri" value="2000+" />
              <StatBadge label="Güvenli Ödeme" value="Easygo" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-gradient-to-br from-white to-[#f6edf6] p-4 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-zinc-900">{value}</p>
    </div>
  );
}
