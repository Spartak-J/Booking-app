import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export type Language = 'uk' | 'ru' | 'en';

type LanguageState = {
  language: Language;
  hydrate: () => Promise<void>;
  setLanguage: (language: Language) => Promise<void>;
};

const LANG_KEY = 'app_language';

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'uk',
  hydrate: async () => {
    const saved = await SecureStore.getItemAsync(LANG_KEY);
    if (saved) set({ language: saved as Language });
  },
  setLanguage: async (language: Language) => {
    await SecureStore.setItemAsync(LANG_KEY, language);
    set({ language });
  },
}));
