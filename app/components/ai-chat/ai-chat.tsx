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
    {
      sender: "user",
      content: Array.from(Array(80).keys())
        .map(() => "Some long question")
        .join(" ")
    },
    {
      sender: "ai",
      content: "",
      isPending: true
    }
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
        "bg-popover border-border fixed rounded-xl border px-6 py-10 shadow-lg"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px)`
      }}
      ref={dragRef}
      onMouseDown={handleMouseDown}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-6 cursor-pointer"
        onClick={() => setIsChatOpen(false)}
      >
        <X className="text-foreground" />
      </Button>
      <div className="size-full cursor-default">
        <ScrollArea className="relative h-full">
          <div className="mr-3.5 mb-2 flex flex-1 flex-col gap-5">
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div
        className="flex size-full cursor-default flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex gap-2">
          <InputCopilot
            value={input}
            onChange={setInput}
            onSelect={handleStockSelect}
            placeholder="Type your message... Use @ to search stocks"
            className="flex-1"
          />
          <Button
            className=""
            onClick={handleSendMessage}
            disabled={!input.trim()}
            size="icon"
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AiChat };
