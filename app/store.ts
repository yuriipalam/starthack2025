import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatSize {
  width: number;
  height: number;
}

interface ChatPosition {
  x: number;
  y: number;
}

interface UiState {
  isChatOpen: boolean;
  chatSize: { width: number; height: number };
  chatPosition: { x: number; y: number };
  searchQuery: string;
  searchSuggestions: Array<{ symbol: string; name: string; sector: string }>;
  showSuggestions: boolean;
  setIsChatOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
  setChatSize: (size: ChatSize | ((prev: ChatSize) => ChatSize)) => void;
  setChatPosition: (position: ChatPosition | ((prev: ChatPosition) => ChatPosition)) => void;
  setSearchQuery: (query: string) => void;
  setSearchSuggestions: (suggestions: Array<{ symbol: string; name: string; sector: string }>) => void;
  setShowSuggestions: (show: boolean) => void;
}

const INITIAL_CHAT_WIDTH = 400;
const INITIAL_CHAT_HEIGHT = 500;

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isChatOpen: false,
      chatSize: { width: INITIAL_CHAT_WIDTH, height: INITIAL_CHAT_HEIGHT },
      chatPosition: {
        x: window.innerWidth - INITIAL_CHAT_WIDTH - 20,
        y: window.innerHeight - INITIAL_CHAT_HEIGHT - 20
      },
      searchQuery: "",
      searchSuggestions: [],
      showSuggestions: false,
      setIsChatOpen: (value) =>
        set((state) => ({
          isChatOpen:
            typeof value === "function"
              ? (value as (prev: boolean) => boolean)(state.isChatOpen)
              : value
        })),
      chatSize: { width: INITIAL_CHAT_WIDTH, height: INITIAL_CHAT_HEIGHT },
      setChatSize: (value) =>
        set((state) => ({
          chatSize:
            typeof value === "function"
              ? (value as (prev: ChatSize) => ChatSize)(state.chatSize)
              : value
        })),
      setChatPosition: (value) =>
        set((state) => ({
          chatPosition:
            typeof value === "function"
              ? (value as (prev: ChatPosition) => ChatPosition)(state.chatPosition)
              : value
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchSuggestions: (suggestions) => set({ searchSuggestions: suggestions }),
      setShowSuggestions: (show) => set({ showSuggestions: show })
    }),
    {
      name: "ui-store"
    }
  )
);

export { useUiStore };
