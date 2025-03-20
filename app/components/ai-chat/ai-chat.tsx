import React, { useRef, useState } from "react";
import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/ui/button";
import Message, { type MessageProps } from "@/components/ai-chat/message";
import { Input } from "@/ui/input";
import { ScrollArea } from "@/ui/scroll-area";

const AiChat = () => {
  const isChatOpen = useUiStore((state) => state.isChatOpen);
  const setIsChatOpen = useUiStore((state) => state.setIsChatOpen);
  const { width, height } = useUiStore((state) => state.chatSize);
  const { x, y } = useUiStore((state) => state.chatPosition);
  const setChatPosition = useUiStore((state) => state.setChatPosition);

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
        <ScrollArea className="relative h-full pb-5">
          <div className="mr-3.5 flex flex-1 flex-col gap-5">
            {messages.map((message) => (
              <Message {...message} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <Input />
    </div>
  );
};

export { AiChat };
