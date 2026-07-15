"use client";

import { useConfirmStore } from "@/stores/useConfirmStore";

export default function ConfirmDialog() {
  const { open, title, message, onConfirm, close } = useConfirmStore();

  if (!open) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-3 text-sm text-gray-600">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={close}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}