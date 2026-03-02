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

      <main className="mx-auto w-full max-w-[1320px] space-y-8 px-4 py-10 sm:px-6">
        <section className="mag-card rounded-3xl p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mag-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6581]">
                Butikcim Woman
              </p>
              <h1 className="mag-heading mt-1 text-4xl font-bold text-zinc-900 sm:text-5xl">
                Kadın Koleksiyonu
              </h1>
              <p className="mt-2 text-sm text-[#5f5368]">
                Arama, kategori ve indirim filtresiyle stiline uygun parçayı hızla seç.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-[#59254d] to-[#8f3c71] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white">
              {filteredProducts.length} ürün listelendi
            </div>
          </div>
        </section>

        <section className="mag-card rounded-3xl p-5">
          <form
            method="get"
            action="/urunler"
            className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto_auto]"
          >
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Ürün Ara
              <input
                name="q"
                defaultValue={query}
                placeholder="Örn: Elbise, Triko..."
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 outline-none ring-fuchsia-200 focus:ring"
              />
            </label>

            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Kategori
              <select
                name="kategori"
                defaultValue={selectedCategory}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 outline-none ring-fuchsia-200 focus:ring"
              >
                <option value="">Tüm kategoriler</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              İndirim
              <select
                name="indirim"
                defaultValue={selectedDiscount}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 outline-none ring-fuchsia-200 focus:ring"
              >
                <option value="">Tüm ürünler</option>
                <option value="1">Sadece indirimdekiler</option>
              </select>
            </label>

            <button
              type="submit"
              className="ui-click rounded-xl bg-[#2f1931] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b54486] md:self-end"
            >
              Filtrele
            </button>

            <Link
              href="/urunler"
              className="ui-click rounded-xl border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486] md:self-end"
            >
              Temizle
            </Link>
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
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
