import type { Route } from "./+types/home";
import { StockDashboard } from "@/components/stock-dashboard/stock-dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <StockDashboard />
      <div className="absolute right-4 bottom-4 size-5 rounded-full bg-red-500"></div>
    </div>
  );
}
