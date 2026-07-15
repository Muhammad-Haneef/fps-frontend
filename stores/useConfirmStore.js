// stores/useConfirmStore.js

import { create } from "zustand";

export const useConfirmStore = create((set) => ({
  open: false,
  title: "Confirm",
  message: "",
  onConfirm: null,

  confirm: ({ title, message, onConfirm }) =>
    set({
      open: true,
      title,
      message,
      onConfirm,
    }),

  close: () =>
    set({
      open: false,
      onConfirm: null,
    }),
}));