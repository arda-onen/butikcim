import Image from "next/image";
import Link from "next/link";
import { getDiscountedPrice } from "@/lib/pricing";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    discountPercent: number;
    rating: number;
    stock: number;
    badge?: string | null;
    imageUrl?: string | null;
    colorFrom?: string | null;
    colorTo?: string | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const colorFrom = product.colorFrom ?? "from-fuchsia-400";
  const colorTo = product.colorTo ?? "to-violet-300";
  const priced = getDiscountedPrice(product.price, product.discountPercent);
  const filledStars = Math.max(0, Math.min(5, Math.round(product.rating)));
  const stars = Array.from({ length: 5 }, (_, i) => i < filledStars);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl shadow-zinc-300/30 transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div
        className={`relative h-80 overflow-hidden bg-gradient-to-br ${colorFrom} ${colorTo} p-4 sm:h-[23rem]`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.08]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/60" />
        <div className="relative z-10 flex items-start justify-between">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-700">
            {product.category}
          </span>
          {product.badge ? (
            <span className="rounded-full bg-[#b54486]/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-10 opacity-100 transition duration-300 sm:opacity-0 sm:group-hover:opacity-100">
          <Link
            href={`/urunler/${product.id}`}
            className="ui-click block rounded-xl bg-white/95 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-zinc-900"
          >
            İncele
          </Link>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <Link
          href={`/urunler/${product.id}`}
          className="ui-click mag-heading block text-[1.35rem] font-bold leading-snug text-zinc-900 hover:text-[#b54486]"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            {stars.map((filled, i) => (
              <span key={i} className={filled ? "text-amber-500" : "text-zinc-300"}>
                ★
              </span>
            ))}
            <span className="ml-1 text-[11px] font-medium text-zinc-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>
          <span>{product.stock} stok</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {priced.hasDiscount ? (
              <>
                <p className="text-[11px] font-semibold text-zinc-400 line-through">
                  {priced.originalPrice} TL
                </p>
                <p className="text-xl font-black text-zinc-900">
                  {priced.finalPrice} TL
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a2486e]">
                  %{priced.discountPercent} indirim
                </p>
              </>
            ) : (
              <p className="text-xl font-black text-zinc-900">{product.price} TL</p>
            )}
          </div>
          <form method="post" action="/api/cart/add">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value="1" />
            <input type="hidden" name="returnTo" value="/sepetim" />
            <button className="ui-click rounded-xl bg-[#2f1931] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#b54486]">
              Sepete Ekle
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
