"use client";

import { useState, useMemo } from "react";
import { useEntries } from "@/hooks/useEntries";
import EntryCard from "@/components/EntryCard";
import { CATEGORIES, CATEGORY_KEYS, type CategoryKey } from "@/lib/constants";
import { formatDateKR, formatMoney } from "@/lib/utils";

export default function HistoryPage() {
  const { entries, loaded, removeEntry } = useEntries();
  const [filter, setFilter] = useState<CategoryKey | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((e) => e.category === filter);
  }, [entries, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
    for (const entry of sorted) {
      const group = map.get(entry.date) || [];
      group.push(entry);
      map.set(entry.date, group);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (!loaded) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-zinc-600 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="text-lg font-bold">지출 내역</h1>

      {/* Category filter */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
            filter === "all"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400"
          }`}
        >
          전체
        </button>
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              filter === key
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400"
            }`}
          >
            {CATEGORIES[key].emoji} {CATEGORIES[key].label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {grouped.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-3xl">📝</p>
          <p className="mt-2 text-sm text-gray-400">아직 기록이 없어요</p>
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {grouped.map(([date, items]) => {
            const dayTotal = items.reduce((s, e) => s + e.amount, 0);
            return (
              <div key={date}>
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {formatDateKR(date)}
                  </span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {formatMoney(dayTotal)}
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  {items.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} onDelete={removeEntry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
