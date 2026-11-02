import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LanguageViewMode = 'both' | 'ar' | 'en';

interface LanguageViewState {
  mode: LanguageViewMode;
  setMode: (mode: LanguageViewMode) => void;
  cycleMode: () => void;
}

export const useLanguageViewStore = create<LanguageViewState>()(
  persist(
    (set) => ({
      mode: 'both',
      setMode: (mode) => set({ mode }),
      cycleMode: () =>
        set((state) => {
          if (state.mode === 'both') return { mode: 'ar' };
          if (state.mode === 'ar') return { mode: 'en' };
          return { mode: 'both' };
        }),
    }),
    {
      name: 'language-view-mode',
    }
  )
);
