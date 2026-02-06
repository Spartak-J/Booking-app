import { create } from 'zustand';

type SavedState = {
  savedIds: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
};

export const useSavedStore = create<SavedState>((set, get) => ({
  savedIds: [],
  toggle: (id: string) =>
    set((state) => {
      const exists = state.savedIds.includes(id);
      return {
        savedIds: exists ? state.savedIds.filter((x) => x !== id) : [...state.savedIds, id],
      };
    }),
  isSaved: (id: string) => get().savedIds.includes(id),
}));
