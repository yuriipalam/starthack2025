import React from "react";

const DotsLoader = () => {
  return (
    <div className="flex items-center gap-1">
      <span className="sr-only">Loading...</span>
      <div className="bg-foreground/75 size-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
      <div className="bg-foreground/75 size-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
      <div className="bg-foreground/75 size-2 animate-bounce rounded-full"></div>
    </div>
  );
};

export { DotsLoader };
