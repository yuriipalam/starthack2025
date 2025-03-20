import { Search, Bell, Settings, User, BotMessageSquare } from "lucide-react";
import { Input } from "@/ui/input";
import { useUiStore } from "@/store";
import { Button } from "@/ui/button";

export function Header() {
  const setIsChatOpen = useUiStore((state) => state.setIsChatOpen);

  return (
    <header className="fixed right-0 left-0 border-b border-zinc-800 bg-zinc-900 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-primary text-xl font-bold">SIX</h1>
          <nav className="hidden items-center gap-4 md:flex">
            <a
              href="#"
              className="hover:text-primary cursor-pointer text-sm transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="hover:text-primary cursor-pointer text-sm transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#"
              className="hover:text-primary cursor-pointer text-sm transition-colors"
            >
              Watchlists
            </a>
            <a
              href="#"
              className="hover:text-primary cursor-pointer text-sm transition-colors"
            >
              Screener
            </a>
            <a
              href="#"
              className="hover:text-primary cursor-pointer text-sm transition-colors"
            >
              News
            </a>
            <div className="relative hidden w-64 md:block">
              <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform text-zinc-500" />
              <Input
                className="h-8 pl-8 text-sm"
                placeholder="Search symbols, companies..."
              />
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            className="from-primary hover:to-primary h-8 cursor-pointer bg-gradient-to-r to-[#c51800] text-sm font-normal transition-colors duration-200 ease-in-out hover:from-[#c51800] active:from-[#b70000] active:to-[#b70000]"
            onClick={() => setIsChatOpen((prev) => !prev)}
          >
            <BotMessageSquare className="hover:text-primary h-5 w-5 transition-colors" />
            FinAi Assistant
          </Button>
          <button className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-zinc-800">
            <Bell className="hover:text-primary h-5 w-5" />
          </button>
          <button className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-zinc-800">
            <Settings className="hover:text-primary h-5 w-5" />
          </button>
          <button className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-zinc-800">
            <User className="hover:text-primary h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
