import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('makler_theme');
  if (saved) return saved;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('makler_theme', next);
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    localStorage.setItem('makler_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  }
}));

// Apply on initial load
document.documentElement.setAttribute('data-theme', getInitialTheme());
