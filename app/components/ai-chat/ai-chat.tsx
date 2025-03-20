import React, { useRef, useState } from "react";
import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";
import { InputCopilot } from "./input-copilot";

const AiChat = () => {
  const isChatOpen = useUiStore((state) => state.isChatOpen);
  const { width, height } = useUiStore((state) => state.chatSize);
  const { x, y } = useUiStore((state) => state.chatPosition);
  const setChatPosition = useUiStore((state) => state.setChatPosition);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);

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
    setChatPosition({
      x: x + event.movementX,
      y: y + event.movementY
    });
  };

  const handleStockSelect = (stock: { symbol: string; name: string; sector: string }) => {
    console.log("Selected stock:", stock);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = { role: "user" as const, content: message };
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // TODO: Implement actual AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm here to help! What would you like to know?" }
      ]);
    }, 1000);
  };

  return (
    <div
      className={cn(
        isChatOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
        "bg-popover border-border fixed flex flex-col rounded-xl border p-5"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px)`
      }}
      ref={dragRef}
      onMouseDown={handleMouseDown}
    >
      <div
        className="size-full cursor-default flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg max-w-[80%]",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              )}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <InputCopilot
            value={message}
            onChange={setMessage}
            onSelect={handleStockSelect}
            placeholder="Type your message... Use @ to search stocks"
            className="flex-1"
          />
          <button
            className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export { AiChat };
