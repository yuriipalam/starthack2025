import React from "react";
import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";

const AiChat = () => {
  const isChatOpen = useUiStore((state) => state.isChatOpen);

  return (
    <div
      className={cn(
        isChatOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
        "absolute right-4 bottom-4"
      )}
    >
      <div className="size-5 rounded-full bg-red-500"></div>
    </div>
  );
};

export { AiChat };
