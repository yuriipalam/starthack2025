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
  setIsChatOpen: (isChatOpen: boolean | ((prev: boolean) => boolean)) => void;
  chatSize: ChatSize;
  setChatSize: (chatSize: ChatSize | ((prev: ChatSize) => ChatSize)) => void;
  chatPosition: ChatPosition;
  setChatPosition: (
    chatPosition: ChatPosition | ((prev: ChatPosition) => ChatPosition)
  ) => void;
}

const INITIAL_CHAT_WIDTH = 400;
const INITIAL_CHAT_HEIGHT = 500;

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
        })),
      chatSize: { width: INITIAL_CHAT_WIDTH, height: INITIAL_CHAT_HEIGHT },
      setChatSize: (value) =>
        set((state) => ({
          chatSize:
            typeof value === "function"
              ? (value as (prev: ChatSize) => ChatSize)(state.chatSize)
              : value
        })),
      chatPosition: {
        x: window.innerWidth - INITIAL_CHAT_WIDTH - 20,
        y: window.innerHeight - INITIAL_CHAT_HEIGHT - 20
      },
      setChatPosition: (value) =>
        set((state) => ({
          chatPosition:
            typeof value === "function"
              ? (value as (prev: ChatPosition) => ChatPosition)(
                  state.chatPosition
                )
              : value
        }))
    }),
    {
      name: "ui-store"
    }
  )
);

export { useUiStore };
