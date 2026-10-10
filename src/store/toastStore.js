import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: ({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export const toast = {
  success: (msg) => useToastStore.getState().addToast({ message: msg, type: 'success' }),
  error: (msg) => useToastStore.getState().addToast({ message: msg, type: 'error' }),
  info: (msg) => useToastStore.getState().addToast({ message: msg, type: 'info' }),
  warning: (msg) => useToastStore.getState().addToast({ message: msg, type: 'warning' })
};
