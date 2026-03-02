"use client";

type SearchMenuProps = {
  className?: string;
};

export function SearchMenu({ className }: SearchMenuProps) {
  return (
    <details className={`relative ${className ?? ""}`}>
      <summary className="ui-click relative inline-flex h-10 w-10 list-none items-center justify-center rounded-xl border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm marker:content-[''] hover:border-zinc-300 hover:text-[#b54486]">
        <SearchIcon />
      </summary>
      <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-xl">
        <form method="get" action="/urunler" className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Ürün Ara
          </label>
          <input
            name="q"
            placeholder="Ürün adı yaz..."
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none ring-fuchsia-200 focus:ring"
          />
          <button className="ui-click w-full rounded-xl bg-[#2f1931] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#b54486]">
            Ara
          </button>
        </form>
      </div>
    </details>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
