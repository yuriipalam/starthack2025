import React from "react";
import { BotMessageSquare } from "lucide-react";
import { DotsLoader } from "@/components/ai-chat/dots-loader";
import { NvidiaStockChart } from "@/components/stock-dashboard/nvidia-stock-chart";

export interface MessageProps {
  sender: "ai" | "user";
  content?: string;
  isPending?: boolean;
  isLoading?: boolean;
}

const containsNvidiaStockQuery = (content: string = "") => {
  const lowerContent = content.toLowerCase();
  return lowerContent.includes("nvidia") && 
         (lowerContent.includes("stock") || 
          lowerContent.includes("price") || 
          lowerContent.includes("shares"));
};

const Message = (props: MessageProps) => {
  const showNvidiaChart = props.sender === "ai" && containsNvidiaStockQuery(props.content);

  return props.sender === "user" ? (
    <div className="bg-muted flex max-w-9/12 self-end rounded-md px-3 py-2">
      <p className="self-end text-sm">{props.content}</p>
    </div>
  ) : (
    <div className="flex max-w-9/12 gap-2 self-start">
      <BotMessageSquare className="text-primary bg-background/75 size-8 shrink-0 rounded-full p-1.5" />
      <div className="flex flex-col gap-4">
        {props.isPending ? (
          <DotsLoader />
        ) : (
          <>
            <p className="mt-1 text-sm">{props.content}</p>
            {showNvidiaChart && (
              <div className="mt-4 w-full min-w-[300px]">
                <NvidiaStockChart />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
