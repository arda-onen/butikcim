"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MobileCartMenuProps = {
  rows: Array<{
    id: number;
    name: string;
    quantity: number;
    finalPrice: number;
  }>;
  total: number;
};

export function MobileCartMenu({ rows, total }: MobileCartMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current) return;
      const target = event.target as Node;
      if (!containerRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label="Sepet özetini aç"
        onClick={() => setOpen((prev) => !prev)}
        className="ui-click inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-300 hover:text-rose-500"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Sepet Özeti
          </p>
          {rows.length > 0 ? (
            <>
              <div className="mt-3 space-y-2">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-xl border border-zinc-100 bg-zinc-50 p-2.5"
                  >
                    <p className="line-clamp-1 text-sm font-semibold text-zinc-800">
                      {row.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {row.quantity} x {row.finalPrice} TL
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-sm">
                <span className="font-medium text-zinc-500">Toplam</span>
                <span className="font-black text-zinc-900">{total} TL</span>
              </div>
              <Link
                href="/sepetim"
                onClick={() => setOpen(false)}
                className="ui-click mt-3 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-rose-500"
              >
                Sepetime Git
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">Sepetin şu an boş.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
