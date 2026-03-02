import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { getDiscountedPrice } from "@/lib/pricing";
import { AdminDiscountSelectionForm } from "@/components/admin-discount-selection-form";

type DiscountSearchParams = {
  kategori?: string;
  q?: string;
  discount_updated?: string;
  discount_count?: string;
  error?: string;
};

export default async function AdminDiscountPage({
  searchParams,
}: {
  searchParams: Promise<DiscountSearchParams>;
}) {
  const params = await searchParams;
  const selectedCategoryId = Number(params.kategori);
  const hasCategoryFilter =
    Number.isFinite(selectedCategoryId) && selectedCategoryId > 0;
  const query = (params.q ?? "").trim();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    where: {
      categoryId: hasCategoryFilter ? selectedCategoryId : undefined,
      name: query ? { contains: query } : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  const filterQuery = new URLSearchParams();
  if (hasCategoryFilter) {
    filterQuery.set("kategori", String(selectedCategoryId));
  }
  if (query) {
    filterQuery.set("q", query);
  }
  const redirectTo = filterQuery.size
    ? `/admin/indirimler?${filterQuery.toString()}`
    : "/admin/indirimler";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <section className="fade-in-up mag-card rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mag-heading text-sm font-semibold uppercase tracking-[0.16em] text-[#b54486]">
                Admin
              </p>
              <h1 className="mag-heading mt-1 text-4xl font-bold text-zinc-900">
                İndirim Yönetimi
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Ürünleri filtrele, tablodan seç ve toplu indirim uygula.
              </p>
            </div>
            <Link
              href="/admin/panel"
              className="ui-click rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
            >
              Panele Dön
            </Link>
          </div>
        </section>

        <section className="fade-in-up mag-card rounded-3xl p-5">
          <form
            method="get"
            action="/admin/indirimler"
            className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]"
          >
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Kategori
              <select
                name="kategori"
                defaultValue={hasCategoryFilter ? String(selectedCategoryId) : ""}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none ring-fuchsia-200 focus:ring"
              >
                <option value="">Tüm kategoriler</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Ürün Ara
              <input
                name="q"
                defaultValue={query}
                placeholder="Ürün adına göre ara"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none ring-fuchsia-200 focus:ring"
              />
            </label>
            <button className="ui-click rounded-xl bg-[#2f1931] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b54486] md:self-end">
              Filtrele
            </button>
            <Link
              href="/admin/indirimler"
              className="ui-click rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-center text-sm font-semibold text-zinc-600 md:self-end"
            >
              Sıfırla
            </Link>
          </form>
        </section>

        <section className="fade-in-up mag-card rounded-3xl p-5">
          {params.discount_updated ? (
            <div className="ui-alert ui-alert-success mb-4">
              İndirim güncellendi ({params.discount_count ?? "0"} ürün).
            </div>
          ) : null}
          {params.error === "discount_form" ? (
            <div className="ui-alert ui-alert-error mb-4">
              İndirim oranı geçersiz. 0-90 arasında bir değer gir.
            </div>
          ) : null}
          {params.error === "discount_target" ? (
            <div className="ui-alert ui-alert-error mb-4">
              Tablodan en az bir ürün seçmelisin.
            </div>
          ) : null}
          {params.error === "discount_empty" ? (
            <div className="ui-alert ui-alert-warn mb-4">
              Seçilen ürünler bulunamadı, filtreyi yenileyip tekrar dene.
            </div>
          ) : null}

          <AdminDiscountSelectionForm
            redirectTo={redirectTo}
            products={products.map((product) => {
              const priced = getDiscountedPrice(
                product.price,
                product.discountPercent,
              );
              return {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                discountPercent: product.discountPercent,
                finalPrice: priced.finalPrice,
                stock: product.stock,
              };
            })}
          />
        </section>
      </main>
    </div>
  );
}
