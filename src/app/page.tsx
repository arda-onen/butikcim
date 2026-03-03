import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";
import { getDiscountedPrice } from "@/lib/pricing";
import { getSiteSettings } from "@/lib/site-settings";

type HomeCategory = {
  id: number;
  name: string;
  totalProducts: number;
  coverImage: string | null;
};

type HomeProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  discountPercent: number;
  rating: number;
  stock: number;
  badge: string | null;
  imageUrl: string | null;
  colorFrom: string | null;
  colorTo: string | null;
};

export default async function Home() {
  const siteSettings = await getSiteSettings();

  const categoriesRaw = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
      products: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { imageUrl: true },
      },
    },
  });

  const categories: HomeCategory[] = (categoriesRaw as Array<{
    id: number;
    name: string;
    imageUrl: string | null;
    _count: { products: number };
    products: Array<{ imageUrl: string | null }>;
  }>)
    .map((category) => ({
      id: category.id,
      name: category.name,
      totalProducts: category._count.products,
      coverImage: category.imageUrl ?? category.products[0]?.imageUrl ?? null,
    }))
    .sort((a: HomeCategory, b: HomeCategory) => b.totalProducts - a.totalProducts)
    .slice(0, 8);

  const heroProduct = await prisma.product.findFirst({
    where: {
      imageUrl: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      imageUrl: true,
    },
  });

  const products: HomeProduct[] = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const discountedProducts: HomeProduct[] = await prisma.product.findMany({
    where: { discountPercent: { gt: 0 } },
    orderBy: [{ discountPercent: "desc" }, { updatedAt: "desc" }],
    take: 3,
  });

  const heroImage =
    siteSettings?.heroImageUrl ??
    heroProduct?.imageUrl ??
    categories.find((category) => category.coverImage)?.coverImage;
  const featuredCategories = categories.slice(0, 6);
  const heroCategory = featuredCategories[0];
  const sideCategories = featuredCategories.slice(1, 5);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pb-16">
        <section className="mx-auto mt-4 w-full max-w-[1320px] px-4 sm:mt-6 sm:px-6">
          <div className="fade-in-up rounded-2xl bg-gradient-to-r from-[#4b1f42] via-[#702f5f] to-[#4b1f42] px-3 py-2 text-center text-[11px] font-semibold tracking-[0.08em] text-white sm:px-4 sm:py-2.5 sm:text-sm sm:tracking-[0.12em]">
            BUTIKCIM SUNAR: PREMIUM KADIN KOLEKSİYONUNDA SUNUMA ÖZEL SEÇKİLER
          </div>
        </section>

        <section className="mx-auto mt-4 w-full max-w-[1320px] px-4 sm:mt-5 sm:px-6">
          <div className="fade-in-up fade-delay-1 mag-card relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
            <div className="grid min-h-[620px] md:min-h-[74vh] md:grid-cols-[1.08fr_0.92fr]">
              <div className="relative order-2 z-10 flex flex-col justify-center px-5 py-8 sm:px-7 sm:py-10 md:order-1 md:px-12 md:py-12">
                <p className="mag-heading text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6581]">
                  Butikcim 2026
                </p>
                <h1 className="mag-heading mt-3 max-w-2xl text-3xl font-bold leading-[1.08] text-zinc-900 sm:mt-4 sm:text-5xl md:text-[3.85rem]">
                  Butikcim ile
                  <br />
                  Kadın Modasında Premium Vitrin Deneyimi
                </h1>
                <p className="mt-4 max-w-xl text-sm text-[#5f5368] sm:mt-5 sm:text-lg">
                  Butikcim; modern, zarif ve güçlü parçaları tek vitrinde buluşturarak
                  kadın modasında ilham veren bir alışveriş deneyimi sunar.
                </p>
                <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
                  <Link
                    href="/urunler"
                    className="ui-click rounded-xl bg-[#2f1931] px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-[#b54486] sm:text-left"
                  >
                    Alışverişe Başla
                  </Link>
                  <Link
                    href="/urunler"
                    className="ui-click rounded-xl border border-[#d6c5d5] bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486] sm:text-left"
                  >
                    Kategorileri Keşfet
                  </Link>
                </div>
              </div>

              <div className="relative order-1 min-h-[280px] sm:min-h-[320px] md:order-2">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt="Butikcim vitrini"
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-fuchsia-200 to-violet-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f6ebf5]/5 to-[#f6ebf5]/25 md:hidden" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 w-full max-w-[1320px] space-y-5 px-4 sm:mt-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mag-heading text-sm font-semibold uppercase tracking-[0.18em] text-[#b54486]">
                Kategori Vitrini
              </p>
              <h2 className="mag-heading mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl">
                Butikcim Kategorilerini Keşfet
              </h2>
            </div>
            <Link
              href="/urunler"
              className="ui-click rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:border-[#b54486] hover:text-[#b54486]"
            >
              Tümünü Gör
            </Link>
          </div>

          {featuredCategories.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              {heroCategory ? (
                <CategoryCard
                  category={heroCategory}
                  href={`/urunler?kategori=${encodeURIComponent(heroCategory.name)}`}
                  className="min-h-[330px] sm:min-h-[430px]"
                  priority
                />
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                {sideCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    href={`/urunler?kategori=${encodeURIComponent(category.name)}`}
                    className="min-h-[170px] sm:min-h-[205px]"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-6 text-sm text-zinc-600">
              Henüz kategori eklenmedi. Kategoriler ekledikten sonra
              burada listelenecek.
            </div>
          )}
        </section>

        {discountedProducts.length > 0 ? (
          <section className="mx-auto mt-10 w-full max-w-[1320px] space-y-5 px-4 sm:mt-12 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mag-heading text-sm font-semibold uppercase tracking-[0.18em] text-[#91495e]">
                  İndirimler
                </p>
                <h2 className="mag-heading mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl">
                  Butikcim Fırsatlarını Keşfet
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {discountedProducts.map((product) => {
                const priced = getDiscountedPrice(product.price, product.discountPercent);
                return (
                  <Link
                    key={product.id}
                    href={`/urunler/${product.id}`}
                    className="ui-click mag-card group rounded-2xl p-5"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#91495e]">
                      %{priced.discountPercent} İndirim
                    </p>
                    <p className="mt-2 line-clamp-1 text-lg font-bold text-zinc-900">
                      {product.name}
                    </p>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 line-through">
                          {priced.originalPrice} TL
                        </p>
                        <p className="text-2xl font-black text-zinc-900">
                          {priced.finalPrice} TL
                        </p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        İncele
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mt-10 w-full max-w-[1320px] space-y-6 px-4 sm:mt-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mag-heading text-sm font-semibold uppercase tracking-[0.18em] text-[#b54486]">
                Öne Çıkan Ürünler
              </p>
              <h2 className="mag-heading mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl">
                Sunumun Yıldızı Olacak Butikcim Seçimleri
              </h2>
            </div>
            <Link
              href="/urunler"
              className="ui-click rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:border-[#b54486] hover:text-[#b54486]"
            >
              Tümünü Gör
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product: HomeProduct) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6 text-sm text-zinc-600">
              Henüz ürün eklenmemiş. Ürünler ekledikten sonra burada
              öne çıkan ürünler görünecek.
            </div>
          )}
        </section>

        <section className="mx-auto mt-14 w-full max-w-[1320px] px-4 sm:px-6">
          <footer className="fade-in-up fade-delay-3 overflow-hidden rounded-[1.5rem] border border-white/80 bg-gradient-to-r from-[#2f1931] via-[#4c2950] to-[#2f1931] px-5 py-8 text-white sm:rounded-[2rem] sm:px-10 sm:py-10">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <p className="mag-heading text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                  Butikcim Woman
                </p>
                <p className="mag-heading mt-2 text-3xl font-bold">BUTIKCIM</p>
                <p className="mt-3 max-w-md text-sm text-white/80">
                  Butikcim, kadın odaklı premium butik deneyimini modern vitrin dili,
                  güçlü kategori yapısı ve seçili koleksiyonlarla bir araya getirir.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                  Hızlı Linkler
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <Link href="/" className="ui-click block text-white/90 hover:text-white">
                    Ana Sayfa
                  </Link>
                  <Link href="/urunler" className="ui-click block text-white/90 hover:text-white">
                    Koleksiyon
                  </Link>
                  <Link href="/sepetim" className="ui-click block text-white/90 hover:text-white">
                    Sepetim
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                  İletişim
                </p>
                <p className="mt-3 text-sm text-white/85">
                  Soruların için:
                  <br />
                  <span className="font-semibold text-white">destek@butikcim.com</span>
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                  Güvenli Ödeme
                </p>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

function CategoryCard({
  category,
  href,
  className,
  priority,
}: {
  category: HomeCategory;
  href: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl border border-white/80 bg-zinc-100 shadow-xl shadow-zinc-300/30 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${className}`}
    >
      {category.coverImage ? (
        <Image
          src={category.coverImage}
          alt={category.name}
          fill
          priority={priority}
          className="object-cover transition duration-700 group-hover:scale-110"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-fuchsia-200 to-violet-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
        <p className="mag-heading text-xl font-bold uppercase tracking-[0.14em] text-white sm:text-2xl">
          {category.name}
        </p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-white/85">
          {category.totalProducts} ürün
        </p>
      </div>
    </Link>
  );
}
