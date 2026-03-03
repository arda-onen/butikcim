"use client";

import Link from "next/link";

type MobileNavMenuProps = {
  links: Array<{ href: string; label: string }>;
  className?: string;
};

export function MobileNavMenu({ links, className }: MobileNavMenuProps) {
  return (
    <details className={`relative md:hidden ${className ?? ""}`}>
      <summary className="ui-click relative inline-flex h-10 w-10 list-none items-center justify-center rounded-xl border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm marker:content-[''] hover:border-zinc-300 hover:text-[#b54486]">
        <MenuIcon />
      </summary>
      <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-xl">
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ui-click block rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-[#b54486]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </details>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}
