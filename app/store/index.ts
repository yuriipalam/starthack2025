import { create } from "zustand";

export interface StockSuggestion {
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  symbol: string;
}

export interface WhyQuestionSuggestion {
  name: string;
  question: string;
  price: number;
  change: number;
  changePercent: number;
  symbol: string;
}

export type Suggestion = StockSuggestion | WhyQuestionSuggestion;

interface UiStore {
  searchQuery: string;
  searchSuggestions: Suggestion[];
  showSuggestions: boolean;
  setSearchQuery: (query: string) => void;
  setSearchSuggestions: (suggestions: Suggestion[]) => void;
  setShowSuggestions: (show: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  searchQuery: "",
  searchSuggestions: [],
  showSuggestions: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchSuggestions: (suggestions) =>
    set({ searchSuggestions: suggestions }),
  setShowSuggestions: (show) => set({ showSuggestions: show })
}));
