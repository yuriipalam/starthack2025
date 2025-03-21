import React, { useEffect, useRef, useState } from "react";
import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";
import { Send, X } from "lucide-react";
import { Button } from "@/ui/button";
import Message, { type MessageProps } from "@/components/ai-chat/message";
import { ScrollArea } from "@/ui/scroll-area";
import { InputCopilot } from "./input-copilot";

const AiChat = () => {
  const isChatOpen = useUiStore((state) => state.isChatOpen);
  const setIsChatOpen = useUiStore((state) => state.setIsChatOpen);
  const { width, height } = useUiStore((state) => state.chatSize);
  const { x, y } = useUiStore((state) => state.chatPosition);
  const setChatPosition = useUiStore((state) => state.setChatPosition);
  const resetChatPosition = useUiStore((state) => state.resetChatPosition);

  const dragRef = useRef<HTMLDivElement>(null);
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== dragRef.current) return;

    if (dragRef.current) {
      dragRef.current.style.cursor = "grabbing";
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (dragRef.current) {
      dragRef.current.style.cursor = "grab";
    }
  };
  const handleMouseMove = (event: MouseEvent) => {
    setChatPosition((prev) => ({
      x: prev.x + event.movementX,
      y: prev.y + event.movementY
    }));
  };

  const initialMessages: MessageProps[] = [
    {
      sender: "user",
      content: "Why NVIDIA goes down?"
    },
    {
      sender: "ai",
      content:
        "Because China created a new AI which doesn't need NVIDIA's graphic cards to be as fast as the competitors. They basically provide the same performance with lower cost."
    },

  ];
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);

  const [input, setInput] = useState("");
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // TODO: Implement actual AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: "I'm here to help! What would you like to know?"
        }
      ]);
    }, 1000);
  };
  const handleStockSelect = (stock: {
    symbol: string;
    name: string;
    sector: string;
  }) => {
    console.log("Selected stock:", stock);
  };

  useEffect(() => {
    const handleResize = () => {
      resetChatPosition();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div
      className={cn(
        isChatOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
        "bg-popover border-border fixed rounded-xl border shadow-lg"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px)`
      }}
    >
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        className="border-border flex items-center justify-between overflow-hidden border-b px-2 py-1"
      >
        <span className="pointer-events-none text-sm select-none">
          FinAI Assistant
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 cursor-pointer"
          onClick={() => setIsChatOpen(false)}
        >
          <X className="text-foreground" />
        </Button>
      </div>
      <div className="flex h-[calc(100%-36px)] flex-col">
        <ScrollArea className="flex-1">
          <div className="mr-2.5 mb-2 flex flex-1 flex-col gap-5 px-3 pt-4">
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-3">
          <div className="flex gap-2">
            <InputCopilot
              value={input}
              onChange={setInput}
              onSelect={handleStockSelect}
              placeholder="Type your message... Use @ to search stocks"
              className="flex-1"
            />
            <Button
              className="cursor-pointer"
              onClick={handleSendMessage}
              disabled={!input.trim()}
              size="icon"
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AiChat };
