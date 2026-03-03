import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { getDiscountedPrice } from "@/lib/pricing";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
    edit?: string;
  }>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  const editingId = Number(params.edit);
  const editingProduct = Number.isFinite(editingId)
    ? products.find((p) => p.id === editingId)
    : undefined;
  const selectedCategoryId = editingProduct?.categoryId ?? categories[0]?.id ?? "";
  const formAction = editingProduct
    ? `/api/admin/products/${editingProduct.id}`
    : "/api/admin/products";
  const redirectTo = "/admin/urunler";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
        <section className="fade-in-up mag-card rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mag-heading text-sm font-semibold uppercase tracking-[0.16em] text-[#b54486]">
                Admin
              </p>
              <h1 className="mag-heading mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl">
                Ürün Yönetimi
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Ürün ekleme, düzenleme ve silme işlemleri bu sayfada.
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

        <section className="fade-in-up mag-card rounded-3xl p-4 sm:p-5">
          <h2 className="text-lg font-bold text-zinc-900">
            {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {editingProduct
              ? "Seçili ürünü güncelleyin. Fotoğraf seçmezsen mevcut fotoğraf korunur."
              : "Ürünleri fotoğraf ile ekleyin, tablo otomatik güncellensin."}
          </p>

          {params.created ? (
            <div className="ui-alert ui-alert-success mt-4">Ürün başarıyla eklendi.</div>
          ) : null}
          {params.updated ? (
            <div className="ui-alert ui-alert-success mt-4">Ürün başarıyla güncellendi.</div>
          ) : null}
          {params.deleted ? (
            <div className="ui-alert ui-alert-success mt-4">Ürün başarıyla silindi.</div>
          ) : null}
          {params.error === "form" ? (
            <div className="ui-alert ui-alert-error mt-4">Lütfen zorunlu alanları doldurun.</div>
          ) : null}
          {params.error === "size" ? (
            <div className="ui-alert ui-alert-warn mt-4">Fotoğraf boyutu en fazla 4MB olabilir.</div>
          ) : null}
          {params.error === "notfound" ? (
            <div className="ui-alert ui-alert-warn mt-4">Düzenlenmek istenen ürün bulunamadı.</div>
          ) : null}
          {params.error === "category" ? (
            <div className="ui-alert ui-alert-error mt-4">Geçerli bir kategori seçmelisiniz.</div>
          ) : null}

          <form
            method="post"
            action={formAction}
            encType="multipart/form-data"
            className="mt-4 grid gap-3 md:grid-cols-2"
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />
            {editingProduct ? <input type="hidden" name="intent" value="update" /> : null}
            <label className="text-sm font-medium text-zinc-700">
              Ürün Adı
              <input
                required
                name="name"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                placeholder="Örn: Satin Midi Elbise"
                defaultValue={editingProduct?.name}
              />
            </label>
            <label className="text-sm font-medium text-zinc-700">
              Kategori
              <select
                required
                name="categoryId"
                defaultValue={String(selectedCategoryId)}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
              >
                {categories.length === 0 ? <option value="">Önce kategori ekleyin</option> : null}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-700">
              Fiyat (TL)
              <input
                required
                type="number"
                min="0"
                name="price"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                defaultValue={editingProduct?.price}
              />
            </label>
            <label className="text-sm font-medium text-zinc-700">
              İndirim (%)
              <input
                type="number"
                min="0"
                max="90"
                name="discountPercent"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                placeholder="0"
                defaultValue={editingProduct?.discountPercent ?? 0}
              />
            </label>
            <label className="text-sm font-medium text-zinc-700">
              Stok
              <input
                required
                type="number"
                min="0"
                name="stock"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                defaultValue={editingProduct?.stock}
              />
            </label>
            <label className="text-sm font-medium text-zinc-700">
              Puan (0-5)
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                defaultValue={editingProduct?.rating}
              />
            </label>
            <label className="text-sm font-medium text-zinc-700">
              Etiket (opsiyonel)
              <input
                name="badge"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 outline-none ring-fuchsia-200 focus:ring"
                placeholder="Yeni / Popüler"
                defaultValue={editingProduct?.badge ?? ""}
              />
            </label>
            <label className="text-sm font-medium text-zinc-700 md:col-span-2">
              Ürün Fotoğrafı
              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/webp"
                className="mt-1 w-full rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid gap-2 md:col-span-2 md:flex md:items-center md:gap-3">
              <button className="ui-click rounded-xl bg-[#2f1931] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b54486]">
                {editingProduct ? "Değişiklikleri Kaydet" : "Ürünü Kaydet"}
              </button>
              {editingProduct ? (
                <Link
                  href={redirectTo}
                  className="ui-click rounded-xl border border-zinc-200 bg-white px-5 py-3 text-center text-sm font-semibold text-zinc-700"
                >
                  İptal
                </Link>
              ) : null}
            </div>
          </form>
        </section>

        <section className="fade-in-up mag-card overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h2 className="text-lg font-bold text-zinc-900">Ürün Listesi</h2>
            <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
              {products.length} ürün
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3">Foto</th>
                  <th className="px-5 py-3">Ürün</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Fiyat</th>
                  <th className="px-5 py-3">İndirim</th>
                  <th className="px-5 py-3">Stok</th>
                  <th className="px-5 py-3">Puan</th>
                  <th className="px-5 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const priced = getDiscountedPrice(product.price, product.discountPercent);
                  return (
                    <tr key={product.id} className="border-t border-zinc-100 text-sm text-zinc-700">
                      <td className="px-5 py-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-fuchsia-200 to-violet-200" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-semibold">{product.name}</td>
                      <td className="px-5 py-3">{product.category}</td>
                      <td className="px-5 py-3">
                        {priced.hasDiscount ? (
                          <div>
                            <p className="font-semibold text-zinc-900">{priced.finalPrice} TL</p>
                            <p className="text-xs text-zinc-400 line-through">{product.price} TL</p>
                          </div>
                        ) : (
                          `${product.price} TL`
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {product.discountPercent > 0 ? `%${product.discountPercent}` : "-"}
                      </td>
                      <td className="px-5 py-3">{product.stock}</td>
                      <td className="px-5 py-3">{product.rating.toFixed(1)} ★</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/urunler?edit=${product.id}`}
                            className="ui-click rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:border-fuchsia-300 hover:text-fuchsia-600"
                          >
                            Düzenle
                          </Link>
                          <DeleteConfirmButton
                            action={`/api/admin/products/${product.id}`}
                            triggerLabel="Sil"
                            confirmTitle="Ürün silinsin mi?"
                            confirmMessage={`"${product.name}" ürününü kalıcı olarak silmek istediğine emin misin?`}
                            submitLabel="Ürünü Sil"
                            hiddenFields={[
                              { name: "intent", value: "delete" },
                              { name: "redirectTo", value: redirectTo },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8" colSpan={8}>
                      <p className="ui-empty text-center">
                        Henüz ürün yok. Üstteki formdan ilk ürününü ekleyebilirsin.
                      </p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
