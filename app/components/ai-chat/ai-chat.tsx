import React, { useEffect, useRef, useState } from "react";
import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";
import { Send, X } from "lucide-react";
import { Button } from "@/ui/button";
import Message, { type MessageProps } from "@/components/ai-chat/message";
import { ScrollArea } from "@/ui/scroll-area";
import { InputCopilot } from "./input-copilot";
import { getStockResponse } from "@/lib/mock-responses";
import { stockData } from "@/lib/mock-data";

const AiChat = () => {
  const isChatOpen = useUiStore((state) => state.isChatOpen);
  const setIsChatOpen = useUiStore((state) => state.setIsChatOpen);
  const { width, height } = useUiStore((state) => state.chatSize);
  const { x, y } = useUiStore((state) => state.chatPosition);
  const setChatPosition = useUiStore((state) => state.setChatPosition);
  const resetChatPosition = useUiStore((state) => state.resetChatPosition);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      content: "What is the stock of NVIDIA?"
    },
    {
      sender: "ai",
      content: "NVIDIA is a company that makes graphic cards for computers."
    }

  ];
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);

  const [input, setInput] = useState("");
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    sector: string;
    price?: number;
    changePercent?: number;
  } | null>(null);

  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const streamResponse = (response: string) => {
    const words = response.split(" ");
    let currentIndex = 0;

    setIsStreaming(true);
    
    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamingMessage(prev => prev + words[currentIndex] + " ");
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
        
        // Add the complete message to the messages array
        setMessages(prev => [
          ...prev.slice(0, -1), // Remove pending message
          {
            sender: "ai",
            content: response
          }
        ]);
        setStreamingMessage("");
      }
    }, 100); // Adjust speed as needed
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // Add a pending message while generating response
    setMessages(prev => [
      ...prev,
      { sender: "ai" as const, isPending: true }
    ]);

    // Generate response using mock data if no stock is selected
    const stockData = selectedStock || {
      name: "EXAMPLE",
      price: 100,
      changePercent: 2.5
    };

    // Get AI response using the stock response generator
    const response = getStockResponse(
      input.trim(),
      stockData.name,
      stockData.changePercent || 0,
      stockData.price || 0
    );

    // Start streaming the response
    streamResponse(response.response);
  };

  const handleStockSelect = (stock: {
    symbol: string;
    name: string;
    sector: string;
  }) => {
    // Find the actual stock data from mock data
    const actualStockData = stockData.find(s => s.symbol === stock.symbol);
    
    setSelectedStock({
      ...stock,
      price: actualStockData?.price || 0,
      changePercent: actualStockData?.changePercent || 0
    });
    console.log("Selected stock:", stock);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

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
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 px-3 pt-4 pb-2">
            {messages.map((message, index) => {
              if (index === messages.length - 1 && message.sender === "ai" && isStreaming) {
                return (
                  <Message
                    key={index}
                    sender="ai"
                    content={streamingMessage}
                  />
                );
              }
              return <Message key={index} {...message} />;
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t p-3 mt-auto">
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
