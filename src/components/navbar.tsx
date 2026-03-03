import Link from "next/link";
import { cookies } from "next/headers";
import { CART_COOKIE_NAME, parseCartCookie } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { getDiscountedPrice } from "@/lib/pricing";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { SearchMenu } from "@/components/search-menu";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Koleksiyon" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/admin", label: "Admin" },
];

export async function Navbar() {
  const cookieStore = await cookies();
  const cartItems = parseCartCookie(cookieStore.get(CART_COOKIE_NAME)?.value);
  const ids = cartItems.map((item) => item.productId);
  const previewProducts = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, price: true, discountPercent: true },
      })
    : [];
  const previewMap = new Map(previewProducts.map((product) => [product.id, product]));
  const previewRows = cartItems
    .map((item) => {
      const product = previewMap.get(item.productId);
      if (!product) {
        return null;
      }
      const priced = getDiscountedPrice(product.price, product.discountPercent);
      return {
        ...product,
        quantity: item.quantity,
        priced,
        subtotal: priced.finalPrice * item.quantity,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
  const cartCount = previewRows.reduce((sum, row) => sum + row.quantity, 0);
  const previewTotal = previewRows.reduce((sum, row) => sum + row.subtotal, 0);

  return (
    <header className="sticky top-0 z-50">
      <div className="w-full bg-gradient-to-r from-[#2b1228] via-[#4e1f43] to-[#2b1228] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.12em] text-white sm:text-xs">
        KADIN MODA VİTRİNİ - GÜVENLİ ÖDEME
      </div>
      <nav className="border-b border-white/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <MobileNavMenu links={links} />
            <Link href="/" className="ui-click">
              <p className="mag-heading text-[9px] font-bold uppercase tracking-[0.18em] text-[#8d6581] sm:text-[11px] sm:tracking-[0.24em]">
                Butikcim Woman
              </p>
              <p className="mag-heading -mt-0.5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                BUTIK<span className="text-[#b54486]">CIM</span>
              </p>
            </Link>
          </div>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="ui-click text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 hover:text-[#b54486]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <SearchMenu />
            <div className="group relative hidden md:block">
              <IconButton
                label=""
                badge={cartCount > 0 ? String(cartCount) : undefined}
                href="/sepetim"
              >
                <CartIcon />
              </IconButton>

              <div className="pointer-events-none absolute right-0 top-[calc(100%+10px)] z-50 w-80 translate-y-2 rounded-2xl border border-zinc-200/80 bg-white/95 p-4 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Sepet Özeti
                </p>
                {previewRows.length > 0 ? (
                  <>
                    <div className="mt-3 space-y-2">
                      {previewRows.slice(0, 2).map((row) => (
                        <div
                          key={row.id}
                          className="rounded-xl border border-zinc-100 bg-zinc-50 p-2.5"
                        >
                          <p className="line-clamp-1 text-sm font-semibold text-zinc-800">
                            {row.name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {row.quantity} x {row.priced.finalPrice} TL
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm">
                      <span className="font-medium text-zinc-500">Toplam</span>
                      <span className="font-black text-zinc-900">{previewTotal} TL</span>
                    </div>
                    <Link
                      href="/sepetim"
                      className="ui-click mt-3 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-rose-500"
                    >
                      Sepetime Git
                    </Link>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-zinc-500">Sepetin şu an boş.</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <IconButton
                label="Sepet"
                badge={cartCount > 0 ? String(cartCount) : undefined}
                href="/sepetim"
                className="w-auto gap-1.5 px-3 text-xs font-semibold"
              >
                <CartIcon />
                <span>Sepet</span>
              </IconButton>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function IconButton({
  label,
  badge,
  href,
  className: extraClassName,
  children,
}: {
  label: string;
  badge?: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const baseClassName =
    "ui-click relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm hover:border-zinc-300 hover:text-[#b54486]";
  const className = extraClassName
    ? `${baseClassName} ${extraClassName}`
    : baseClassName;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {badge ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
            {badge}
          </span>
        ) : null}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={className}>
      {badge ? (
        <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
      {children}
    </button>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L20 7H7" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  );
}

