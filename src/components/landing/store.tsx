// store.ts
import { create } from "zustand";

interface StoreState {
  dividerPosition: number;
  setDividerPosition: (position: number) => void;
}

const useStore = create<StoreState>((set) => ({
  dividerPosition: 50,
  setDividerPosition: (position) => set({ dividerPosition: position }),
}));

export default useStore;
