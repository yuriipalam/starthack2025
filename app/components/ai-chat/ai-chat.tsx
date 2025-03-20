import React, { useRef } from "react";
import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";

const AiChat = () => {
  const isChatOpen = useUiStore((state) => state.isChatOpen);
  const { width, height } = useUiStore((state) => state.chatSize);
  const { x, y } = useUiStore((state) => state.chatPosition);
  const setChatPosition = useUiStore((state) => state.setChatPosition);

  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const handleMouseDown = (event: any) => {
    if (event.target !== dragRef.current) {
      return;
    }
    isDragging.current = true;
    if (dragRef.current) {
      dragRef.current.style.cursor = "grabbing";
    }
  };
  const handleMouseUp = (event: any) => {
    if (event.target !== dragRef.current) {
      return;
    }
    isDragging.current = false;
    if (dragRef.current) {
      dragRef.current.style.cursor = "grab";
    }
  };
  const handleMouseMove = (event: any) => {
    if (!isDragging.current || !dragRef.current) {
      return;
    }
    setChatPosition((prev) => ({
      x: prev.x + event.movementX,
      y: prev.y + event.movementY
    }));
  };

  return (
    <div
      className={cn(
        isChatOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
        "bg-popover border-border fixed rounded-xl border p-5"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px)`
      }}
      ref={dragRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="size-full cursor-default"
        onClick={(event) => event.stopPropagation()}
      >
        Dude
      </div>
    </div>
  );
};

export { AiChat };
