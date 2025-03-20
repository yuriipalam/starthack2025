import { Search, Bell, Settings, User } from "lucide-react";
import { Input } from "@/ui/input";

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-primary text-xl font-bold">SIX</h1>
          <nav className="hidden gap-4 md:flex">
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
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden w-64 md:block">
            <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform text-zinc-500" />
            <Input
              className="h-8 pl-8 text-sm"
              placeholder="Search symbols, companies..."
            />
          </div>
          <button className="rounded-full p-1.5 hover:bg-zinc-800">
            <Bell className="h-5 w-5" />
          </button>
          <button className="rounded-full p-1.5 hover:bg-zinc-800">
            <Settings className="h-5 w-5" />
          </button>
          <button className="rounded-full p-1.5 hover:bg-zinc-800">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
