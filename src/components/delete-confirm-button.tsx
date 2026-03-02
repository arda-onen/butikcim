"use client";

import { useState } from "react";

type HiddenField = {
  name: string;
  value: string;
};

type DeleteConfirmButtonProps = {
  action: string;
  triggerLabel: string;
  confirmTitle: string;
  confirmMessage: string;
  submitLabel?: string;
  cancelLabel?: string;
  triggerClassName?: string;
  hiddenFields?: HiddenField[];
};

export function DeleteConfirmButton({
  action,
  triggerLabel,
  confirmTitle,
  confirmMessage,
  submitLabel = "Evet, Sil",
  cancelLabel = "Vazgeç",
  triggerClassName,
  hiddenFields = [],
}: DeleteConfirmButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "ui-click rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
        }
      >
        {triggerLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/45 px-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="modal-enter w-full max-w-md rounded-2xl border border-white/80 bg-white/95 p-5 shadow-2xl">
            <p className="mag-heading text-xs font-semibold uppercase tracking-[0.14em] text-[#a2486e]">
              Onay Gerekli
            </p>
            <h3 className="mt-1 text-lg font-bold text-zinc-900">{confirmTitle}</h3>
            <p className="mt-2 text-sm text-zinc-600">{confirmMessage}</p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                className="ui-click rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-300"
                onClick={() => setOpen(false)}
              >
                {cancelLabel}
              </button>
              <form method="post" action={action}>
                {hiddenFields.map((field) => (
                  <input
                    key={`${field.name}-${field.value}`}
                    type="hidden"
                    name={field.name}
                    value={field.value}
                  />
                ))}
                <button
                  type="submit"
                  className="ui-click rounded-xl bg-[#7f234d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b54486]"
                >
                  {submitLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
