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

interface StockSuggestion {
  name: string;
  sector: string;
}

interface WhyQuestionSuggestion {
  name: string;
  question: string;
}

type Suggestion = StockSuggestion | WhyQuestionSuggestion;

interface UiState {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  chatSize: { width: number; height: number };
  setChatSize: (size: { width: number; height: number }) => void;
  chatPosition: { x: number; y: number };
  setChatPosition: (position: { x: number; y: number }) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchSuggestions: Suggestion[];
  setSearchSuggestions: (suggestions: Suggestion[]) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
}

const INITIAL_CHAT_WIDTH = 400;
const INITIAL_CHAT_HEIGHT = 500;

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isChatOpen: false,
      setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
      chatSize: { width: INITIAL_CHAT_WIDTH, height: INITIAL_CHAT_HEIGHT },
      setChatSize: (size) => set({ chatSize: size }),
      chatPosition: { x: 20, y: 20 },
      setChatPosition: (position) => set({ chatPosition: position }),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchSuggestions: [],
      setSearchSuggestions: (suggestions) => set({ searchSuggestions: suggestions }),
      showSuggestions: false,
      setShowSuggestions: (show) => set({ showSuggestions: show })
    }),
    {
      name: "ui-store"
    }
  )
);

export { useUiStore };
