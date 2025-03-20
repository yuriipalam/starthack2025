export function NewsPanel({ news }: { news: any[] }) {
  return (
    <div className="max-h-[300px] overflow-auto rounded-md bg-zinc-900 p-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Market News</h2>
        <button className="text-xs text-zinc-400 hover:text-zinc-200">
          More
        </button>
      </div>
      <div className="space-y-2">
        {news.map((item, index) => (
          <div
            key={index}
            className="border-b border-zinc-800 pb-2 last:border-0 last:pb-0"
          >
            <div className="cursor-pointer text-sm font-medium hover:text-blue-400">
              {item.title}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-xs text-zinc-400">{item.source}</div>
              <div className="text-xs text-zinc-500">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
