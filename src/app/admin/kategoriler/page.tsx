import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category_created?: string;
    category_updated?: string;
    category_deleted?: string;
    category_deleted_count?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  const redirectTo = "/admin/kategoriler";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <section className="fade-in-up mag-card rounded-3xl p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mag-heading text-sm font-semibold uppercase tracking-[0.16em] text-[#b54486]">
                Admin
              </p>
              <h1 className="mag-heading mt-1 text-4xl font-bold text-zinc-900">
                Kategori Yönetimi
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Kategori ekleme, görsel güncelleme ve silme işlemleri bu sayfada.
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
          {params.category_created ? (
            <div className="ui-alert ui-alert-success mt-1">Kategori eklendi.</div>
          ) : null}
          {params.category_deleted ? (
            <div className="ui-alert ui-alert-success mt-1">
              Kategori silindi. Bu kategoriye bağlı {params.category_deleted_count ?? "0"} ürün de silindi.
            </div>
          ) : null}
          {params.category_updated ? (
            <div className="ui-alert ui-alert-success mt-1">Kategori görseli güncellendi.</div>
          ) : null}
          {params.error === "category_form" ? (
            <div className="ui-alert ui-alert-error mt-1">Kategori adı veya görsel alanı eksik.</div>
          ) : null}
          {params.error === "category_exists" ? (
            <div className="ui-alert ui-alert-warn mt-1">Bu kategori zaten mevcut.</div>
          ) : null}
          {params.error === "category_size" ? (
            <div className="ui-alert ui-alert-warn mt-1">Kategori görseli en fazla 4MB olabilir.</div>
          ) : null}
          {params.error === "category_delete" ? (
            <div className="ui-alert ui-alert-error mt-1">Kategori silinirken bir hata oluştu.</div>
          ) : null}

          <form
            method="post"
            action="/api/admin/categories"
            encType="multipart/form-data"
            className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto]"
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input
              name="name"
              required
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none ring-fuchsia-200 focus:ring"
              placeholder="Yeni kategori adı"
            />
            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/webp"
              className="w-full rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-sm"
            />
            <button className="ui-click rounded-xl bg-[#2f1931] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b54486]">
              Ekle
            </button>
          </form>
        </section>

        <section className="fade-in-up mag-card rounded-3xl p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="mb-2 flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-200">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-fuchsia-200 to-violet-200" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-zinc-700">{category.name}</span>
                </div>

                <form
                  method="post"
                  action={`/api/admin/categories/${category.id}`}
                  encType="multipart/form-data"
                  className="mb-2 flex items-center gap-2"
                >
                  <input type="hidden" name="intent" value="update_image" />
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <input
                    type="file"
                    name="image"
                    accept="image/png,image/jpeg,image/webp"
                    className="w-full rounded-lg border border-dashed border-zinc-300 px-2 py-1.5 text-xs"
                  />
                  <button
                    type="submit"
                    className="ui-click rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs font-semibold"
                  >
                    Güncelle
                  </button>
                </form>

                <DeleteConfirmButton
                  action={`/api/admin/categories/${category.id}`}
                  triggerLabel="Sil"
                  confirmTitle="Kategori silinsin mi?"
                  confirmMessage={`"${category.name}" kategorisini silersen, bu kategoriye bağlı ürünler de kalıcı olarak silinecek. Devam etmek istediğine emin misin?`}
                  triggerClassName="ui-click rounded-lg border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  submitLabel="Kategoriyi Sil"
                  hiddenFields={[{ name: "redirectTo", value: redirectTo }]}
                />
              </div>
            ))}

            {categories.length === 0 ? (
              <p className="ui-empty">Henüz kategori yok. Önce kategori ekleyin.</p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
