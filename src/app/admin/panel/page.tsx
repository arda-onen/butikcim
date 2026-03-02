import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDiscountedPrice } from "@/lib/pricing";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminPanelPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    hero_updated?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const siteSettings = await getSiteSettings();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => {
    const priced = getDiscountedPrice(p.price, p.discountPercent);
    return sum + p.stock * priced.finalPrice;
  }, 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <section className="fade-in-up mag-card rounded-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mag-heading text-sm font-semibold uppercase tracking-[0.16em] text-[#b54486]">
                Admin Dashboard
              </p>
              <h1 className="mag-heading mt-1 text-4xl font-bold text-zinc-900">
                Butikcim Panel
              </h1>
              <p className="mt-3 text-zinc-600">
                Tek admin hesabı için sade ve hızlı yönetim. Ürün ve sipariş
                akışı tek bakışta görünür.
              </p>
            </div>
            <form method="post" action="/api/admin/logout">
              <button
                type="submit"
                className="ui-click rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-[#b54486] hover:text-[#b54486]"
              >
                Güvenli Çıkış
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Toplam Ürün" value={String(totalProducts)} />
          <StatCard label="Toplam Kategori" value={String(categories.length)} />
          <StatCard label="Toplam Stok" value={String(totalStock)} />
          <StatCard label="Stok Değeri" value={`${totalValue} TL`} />
        </section>

        <section className="fade-in-up mag-card rounded-3xl p-5">
          <h2 className="text-lg font-bold text-zinc-900">Ana Sayfa Hero Görseli</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Hero alanı için doğrudan görsel yükleyebilirsin. Yüklendiğinde ana sayfada
            hemen bu görsel kullanılır.
          </p>
          {params.hero_updated ? (
            <div className="ui-alert ui-alert-success mt-4">
              Hero görseli güncellendi.
            </div>
          ) : null}
          {params.error === "hero_form" ? (
            <div className="ui-alert ui-alert-error mt-4">
              Lütfen bir hero görseli seç.
            </div>
          ) : null}
          {params.error === "hero_size" ? (
            <div className="ui-alert ui-alert-warn mt-4">
              Hero görseli en fazla 6MB olabilir.
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 md:grid-cols-[240px_1fr]">
            <div className="relative h-36 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
              {siteSettings?.heroImageUrl ? (
                <Image
                  src={siteSettings.heroImageUrl}
                  alt="Mevcut hero görseli"
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs font-medium text-zinc-500">
                  Henüz özel hero görseli yüklenmedi.
                </div>
              )}
            </div>

            <form
              method="post"
              action="/api/admin/appearance/hero"
              encType="multipart/form-data"
              className="grid gap-2 sm:grid-cols-[1fr_auto]"
            >
              <input
                type="file"
                name="heroImage"
                required
                accept="image/png,image/jpeg,image/webp"
                className="w-full rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-sm"
              />
              <button className="ui-click rounded-xl bg-[#2f1931] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b54486]">
                Hero Görselini Güncelle
              </button>
            </form>
          </div>
        </section>

        <section className="fade-in-up mag-card rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Yönetim Kısayolları</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Kalabalığı azaltmak için kategori ve ürün işlemleri ayrı sayfalara taşındı.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <AdminNavCard
              title="Ürün Yönetimi"
              description="Ürün ekle, düzenle, sil ve stok/fiyat bilgilerini güncelle."
              href="/admin/urunler"
              buttonText="Ürün Sayfasına Git"
            />
            <AdminNavCard
              title="Kategori Yönetimi"
              description="Kategori ekle, görsel güncelle ve silme işlemlerini yönet."
              href="/admin/kategoriler"
              buttonText="Kategori Sayfasına Git"
            />
            <AdminNavCard
              title="İndirim Yönetimi"
              description="Filtreli tablo ile seçili ürünlere toplu indirim uygula."
              href="/admin/indirimler"
              buttonText="İndirim Sayfasına Git"
            />
          </div>
        </section>

        <section className="fade-in-up mag-card rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Hızlı Geçiş</h2>
              <p className="mt-1 text-sm text-zinc-500">
                İstersen doğrudan yönetim sayfalarına buradan da geçebilirsin.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/urunler"
                className="ui-click rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
              >
                Ürünler
              </Link>
              <Link
                href="/admin/kategoriler"
                className="ui-click rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
              >
                Kategoriler
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-gradient-to-br from-white to-[#f6edf6] p-4 shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-zinc-900">{value}</p>
    </div>
  );
}

function AdminNavCard({
  title,
  description,
  href,
  buttonText,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white/85 p-4">
      <h3 className="text-base font-bold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
      <Link
        href={href}
        className="ui-click mt-4 inline-flex rounded-xl bg-[#2f1931] px-3 py-2 text-xs font-semibold text-white hover:bg-[#b54486]"
      >
        {buttonText}
      </Link>
    </div>
  );
}
