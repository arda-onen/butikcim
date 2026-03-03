import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

type FilterParams = {
  q?: string;
  kategori?: string;
  indirim?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<FilterParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const selectedCategory = params.kategori?.trim() ?? "";
  const selectedDiscount = params.indirim === "1" ? "1" : "";

  const womenProducts = await prisma.product.findMany({
    where: { gender: "KADIN" },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const filteredProducts = womenProducts.filter((product) => {
    const passQuery = query
      ? product.name.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))
      : true;
    const passCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const passDiscount = selectedDiscount ? product.discountPercent > 0 : true;
    return passQuery && passCategory && passDiscount;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-[1320px] space-y-4 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-10">
        <section className="mag-card rounded-2xl p-3.5 sm:rounded-3xl sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h1 className="mag-heading text-lg font-bold text-zinc-900 sm:text-5xl">
              Kadın Koleksiyonu
            </h1>
            <div className="w-fit whitespace-nowrap rounded-lg bg-gradient-to-r from-[#59254d] to-[#8f3c71] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm sm:tracking-[0.12em]">
              {filteredProducts.length} ürün listelendi
            </div>
          </div>
        </section>

        <section className="mag-card rounded-2xl p-3 sm:rounded-3xl sm:p-5">
          <form
            method="get"
            action="/urunler"
            className="grid grid-cols-2 gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto_auto]"
          >
            <label className="col-span-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500 sm:text-xs sm:tracking-[0.14em] md:col-span-1">
              Ürün Ara
              <input
                name="q"
                defaultValue={query}
                placeholder="Örn: Elbise, Triko..."
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 outline-none ring-fuchsia-200 focus:ring sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
              />
            </label>

            <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500 sm:text-xs sm:tracking-[0.14em]">
              Kategori
              <select
                name="kategori"
                defaultValue={selectedCategory}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 outline-none ring-fuchsia-200 focus:ring sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
              >
                <option value="">Tüm kategoriler</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500 sm:text-xs sm:tracking-[0.14em]">
              İndirim
              <select
                name="indirim"
                defaultValue={selectedDiscount}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 outline-none ring-fuchsia-200 focus:ring sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
              >
                <option value="">Tüm ürünler</option>
                <option value="1">Sadece indirimdekiler</option>
              </select>
            </label>

            <div className="col-span-2 grid grid-cols-2 gap-2 md:contents">
              <button
                type="submit"
                className="ui-click rounded-lg bg-[#2f1931] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#b54486] sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm md:self-end"
              >
                Filtrele
              </button>

              <Link
                href="/urunler"
                className="ui-click rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-center text-xs font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486] sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm md:self-end"
              >
                Temizle
              </Link>
            </div>
          </form>
          {(query || selectedCategory || selectedDiscount) && (
            <p className="mt-3 text-xs text-zinc-500">
              Aktif filtre: {query ? `"${query}"` : "Tüm ürün adları"} /{" "}
              {selectedCategory || "Tüm kategoriler"} /{" "}
              {selectedDiscount ? "Sadece indirimdekiler" : "Tüm ürünler"}
            </p>
          )}
        </section>

        {womenProducts.length > 0 ? (
          filteredProducts.length > 0 ? (
            <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white/70 p-6 text-sm text-zinc-600">
              Bu filtreye uygun ürün bulunamadı.
            </div>
          )
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/70 p-6 text-sm text-zinc-600">
            Katalog henüz boş. Çok yakında yeni ürünler burada listelenecek.
          </div>
        )}
      </main>
    </div>
  );
}
