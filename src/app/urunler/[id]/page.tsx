import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { getDiscountedPrice } from "@/lib/pricing";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isFinite(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  const priced = getDiscountedPrice(product.price, product.discountPercent);
  const filledStars = Math.max(0, Math.min(5, Math.round(product.rating)));
  const stars = Array.from({ length: 5 }, (_, i) => i < filledStars);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-[1320px] space-y-5 px-4 py-8 sm:space-y-6 sm:px-6 sm:py-10">
        <Link
          href="/urunler"
          className="ui-click inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
        >
          ← Ürünlere Dön
        </Link>

        <section className="mag-card grid gap-6 rounded-3xl p-4 sm:p-6 md:grid-cols-2 md:gap-8">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-zinc-100 sm:min-h-[500px]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-fuchsia-200 to-violet-200" />
            )}
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700">
                {product.category}
              </span>
              <span className="rounded-full bg-[#f4d7ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#7b3863]">
                Kadın koleksiyonu
              </span>
              {product.badge ? (
                <span className="rounded-full bg-[#b54486] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  {product.badge}
                </span>
              ) : null}
            </div>

            <h1 className="mag-heading text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl md:text-5xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-1 text-lg">
              {stars.map((filled, i) => (
                <span key={i} className={filled ? "text-amber-500" : "text-zinc-300"}>
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm font-medium text-zinc-500">
                {product.rating.toFixed(1)} puan
              </span>
            </div>

            <div>
              {priced.hasDiscount ? (
                <>
                  <p className="text-sm font-semibold text-zinc-400 line-through">
                    {priced.originalPrice} TL
                  </p>
                  <p className="text-3xl font-black text-zinc-900 sm:text-4xl">
                    {priced.finalPrice} TL
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#a2486e]">
                    %{priced.discountPercent} sezon indirimi aktif
                  </p>
                </>
              ) : (
                <p className="text-3xl font-black text-zinc-900 sm:text-4xl">{product.price} TL</p>
              )}
            </div>

            <p className="text-sm font-medium text-zinc-600">
              Stok: <span className="font-bold text-zinc-900">{product.stock}</span>
            </p>

            <div className="grid gap-2 pt-1 sm:flex sm:flex-wrap sm:gap-3">
              <form method="post" action="/api/cart/add">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="quantity" value="1" />
                <input type="hidden" name="returnTo" value="/sepetim" />
                <button className="ui-click w-full rounded-xl bg-[#2f1931] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-[#b54486] sm:w-auto">
                  Sepete Ekle
                </button>
              </form>
              <Link
                href="/sepetim"
                className="ui-click rounded-xl border border-zinc-300 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
              >
                Sepetime Git
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
