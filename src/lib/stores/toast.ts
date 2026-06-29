import { writable } from "svelte/store";
import type { ToastMessage } from "$lib/types/shopping";

export const toasts = writable<ToastMessage[]>([]);

let counter = 0;

export function addToast(
  type: ToastMessage["type"],
  message: string,
  duration = 3200,
) {
  const id = ++counter;
  toasts.update((list) => [...list, { id, type, message }]);

  setTimeout(() => {
    dismissToast(id);
  }, duration);
}

export function dismissToast(id: number) {
  toasts.update((list) => list.filter((t) => t.id !== id));
}
