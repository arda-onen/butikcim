"use client";

import { useMemo, useState } from "react";

type DiscountProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  stock: number;
};

type AdminDiscountSelectionFormProps = {
  products: DiscountProductRow[];
  redirectTo: string;
};

export function AdminDiscountSelectionForm({
  products,
  redirectTo,
}: AdminDiscountSelectionFormProps) {
  const allIds = useMemo(() => products.map((product) => product.id), [products]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const allSelected = products.length > 0 && selectedIds.length === products.length;

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? allIds : []);
  }

  function toggleOne(id: number, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id),
    );
  }

  return (
    <form method="post" action="/api/admin/discounts" className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Uygulanacak İndirim (%)
            <input
              required
              type="number"
              min="0"
              max="90"
              name="discountPercent"
              placeholder="Örn: 20"
              className="mt-1 w-52 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none ring-fuchsia-200 focus:ring"
            />
          </label>
          <button className="ui-click rounded-xl bg-[#2f1931] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b54486] disabled:cursor-not-allowed disabled:opacity-60">
            Seçili Ürünlere Uygula
          </button>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Seçilen: {selectedIds.length}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="min-w-full text-left">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => toggleAll(event.currentTarget.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-fuchsia-600 focus:ring-fuchsia-300"
                  />
                  Tümü
                </label>
              </th>
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Normal Fiyat</th>
              <th className="px-4 py-3">İndirim</th>
              <th className="px-4 py-3">İndirimli Fiyat</th>
              <th className="px-4 py-3">Stok</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const checked = selectedIds.includes(product.id);
              return (
                <tr
                  key={product.id}
                  className="border-t border-zinc-100 text-sm text-zinc-700"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      name="productIds"
                      value={product.id}
                      checked={checked}
                      onChange={(event) =>
                        toggleOne(product.id, event.currentTarget.checked)
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-fuchsia-600 focus:ring-fuchsia-300"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.price} TL</td>
                  <td className="px-4 py-3">
                    {product.discountPercent > 0 ? `%${product.discountPercent}` : "-"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900">
                    {product.finalPrice} TL
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                </tr>
              );
            })}
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8">
                  <p className="ui-empty text-center">
                    Bu filtreye uygun ürün bulunamadı.
                  </p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </form>
  );
}
