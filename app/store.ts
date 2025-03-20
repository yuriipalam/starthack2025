import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isChatOpen: boolean;
  setIsChatOpen: (isChatOpen: boolean | ((prev: boolean) => boolean)) => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isChatOpen: false,
      setIsChatOpen: (value) =>
        set((state) => ({
          isChatOpen:
            typeof value === "function"
              ? (value as (prev: boolean) => boolean)(state.isChatOpen)
              : value
        }))
    }),
    {
      name: "ui-store"
    }
  )
);

export { useUiStore };
