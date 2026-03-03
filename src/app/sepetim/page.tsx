import Link from "next/link";
import { cookies } from "next/headers";
import { Navbar } from "@/components/navbar";
import { CART_COOKIE_NAME, parseCartCookie } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { getDiscountedPrice } from "@/lib/pricing";

type CartPageParams = {
  added?: string;
  error?: string;
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<CartPageParams>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const cartItems = parseCartCookie(cookieStore.get(CART_COOKIE_NAME)?.value);
  const ids = cartItems.map((item) => item.productId);
  const products = ids.length
    ? await prisma.product.findMany({ where: { id: { in: ids } } })
    : [];

  const productMap = new Map(products.map((product) => [product.id, product]));
  const rows = cartItems
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        return null;
      }
      const priced = getDiscountedPrice(product.price, product.discountPercent);
      return {
        product,
        quantity: item.quantity,
        priced,
        subtotal: priced.finalPrice * item.quantity,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const total = rows.reduce((sum, row) => sum + row.subtotal, 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-[1320px] space-y-5 px-4 py-8 sm:space-y-6 sm:px-6 sm:py-10">
        <section className="mag-card rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mag-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6581]">
                Butikcim Checkout
              </p>
              <h1 className="mag-heading mt-1 text-2xl font-bold text-zinc-900 sm:text-4xl">
                Sepetim
              </h1>
              <p className="mt-2 text-sm text-[#5f5368]">
                Sepetine eklenen ürünleri kontrol et, sonra Iyzico ile ödemeye geç.
              </p>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-[#4b1f42] to-[#8f3c71] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white sm:py-3 sm:text-sm">
              Toplam: {total} TL
            </div>
          </div>
          {params.added ? (
            <p className="mt-3 text-sm font-semibold text-emerald-600">
              Ürün sepete eklendi.
            </p>
          ) : null}
          {params.error === "email" ? (
            <p className="mt-3 text-sm font-semibold text-rose-600">
              Ödemeye geçmek için geçerli bir e-posta gir.
            </p>
          ) : null}
          {params.error === "empty" ? (
            <p className="mt-3 text-sm font-semibold text-rose-600">
              Sepetin boş. Önce ürün eklemelisin.
            </p>
          ) : null}
          {params.error === "checkout" ? (
            <p className="mt-3 text-sm font-semibold text-rose-600">
              Easygo oturumu başlatılırken hata oluştu, tekrar dene.
            </p>
          ) : null}
        </section>

        {rows.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="mag-card rounded-3xl p-4 sm:p-5">
              <div className="space-y-4">
                {rows.map((row) => (
                  <article
                    key={row.product.id}
                    className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white/80 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                  >
                    <div>
                      <h2 className="text-base font-bold text-zinc-900">
                        {row.product.name}
                      </h2>
                      <p className="text-xs text-zinc-500">{row.product.category}</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-700">
                        Birim Fiyat: {row.priced.finalPrice} TL
                        {row.priced.hasDiscount
                          ? ` (Normal ${row.priced.originalPrice} TL)`
                          : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <form method="post" action="/api/cart/update">
                        <input type="hidden" name="productId" value={row.product.id} />
                        <input type="hidden" name="action" value="dec" />
                        <button className="ui-click rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-bold">
                          -
                        </button>
                      </form>
                      <span className="min-w-8 text-center text-sm font-bold text-zinc-800">
                        {row.quantity}
                      </span>
                      <form method="post" action="/api/cart/update">
                        <input type="hidden" name="productId" value={row.product.id} />
                        <input type="hidden" name="action" value="inc" />
                        <button className="ui-click rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-bold">
                          +
                        </button>
                      </form>
                      <form method="post" action="/api/cart/update" className="sm:ml-2">
                        <input type="hidden" name="productId" value={row.product.id} />
                        <input type="hidden" name="action" value="remove" />
                        <button className="ui-click rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                          Kaldır
                        </button>
                      </form>
                    </div>
                    <p className="self-end text-sm font-black text-zinc-900 sm:self-auto">{row.subtotal} TL</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="mag-card rounded-3xl p-5">
              <h3 className="mag-heading text-2xl font-bold text-zinc-900">Ödeme Özeti</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Hesap gerekmez. Easygo ödeme için sadece e-posta girmen yeterli.
              </p>
              <p className="mt-4 text-2xl font-black text-zinc-900">{total} TL</p>
              <form method="post" action="/api/cart/checkout" className="mt-4 space-y-3">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="E-posta adresin"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-rose-200 focus:ring"
                />
                <button className="ui-click w-full rounded-xl bg-[#2f1931] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-[#b54486]">
                  Ödemeye Geç (Easygo)
                </button>
              </form>
            </aside>
          </section>
        ) : (
          <section className="mag-card rounded-3xl p-8 text-center">
            <p className="text-sm text-zinc-600">Sepetin şu an boş.</p>
            <Link
              href="/urunler"
              className="ui-click mt-4 inline-flex rounded-xl bg-[#2f1931] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b54486]"
            >
              Ürünlere Dön
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
