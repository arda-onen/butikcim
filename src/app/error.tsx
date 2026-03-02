"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-4 py-16 sm:px-6">
      <section className="fade-in-up mag-card w-full rounded-[2rem] p-8 text-center sm:p-12">
        <p className="mag-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#8d6581]">
          Bir Hata Oluştu
        </p>
        <h1 className="mag-heading mt-3 text-4xl font-bold text-zinc-900 sm:text-5xl">
          Sayfa şu anda yüklenemiyor
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-600 sm:text-base">
          Beklenmeyen bir teknik sorun oluştu. Lütfen yeniden dene veya ana sayfaya dön.
        </p>
        {error?.message ? (
          <p className="mx-auto mt-3 max-w-2xl rounded-xl border border-zinc-200 bg-white/70 px-4 py-2 text-xs text-zinc-500">
            {error.message}
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="ui-click rounded-xl bg-[#2f1931] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-[#b54486]"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="ui-click rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-[#b54486] hover:text-[#b54486]"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </section>
    </main>
  );
}
