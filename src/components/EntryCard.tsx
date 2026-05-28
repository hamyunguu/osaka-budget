"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatMoney } from "@/lib/utils";
import type { Entry } from "@/lib/types";

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const cat = CATEGORIES[entry.category];

  return (
    <>
      <div className="flex items-center gap-3 rounded-xl bg-[#F7F7F5] px-4 py-3 dark:bg-zinc-800">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: cat.color + "18" }}
        >
          {cat.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {entry.memo || cat.label}
          </p>
          <p className="text-xs text-gray-400">{cat.label}</p>
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
          -{formatMoney(entry.amount)}
        </span>
        <button
          onClick={() => setShowConfirm(true)}
          className="ml-1 p-1.5 text-gray-300 transition-colors hover:text-red-500 active:scale-90"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40" onClick={() => setShowConfirm(false)}>
          <div className="mx-6 w-full max-w-[320px] rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <p className="text-center text-sm font-medium text-gray-900 dark:text-gray-100">
              이 지출을 삭제할까요?
            </p>
            <p className="mt-1 text-center text-xs text-gray-400">
              {cat.emoji} {entry.memo || cat.label} · {formatMoney(entry.amount)}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-600 scale97 dark:bg-zinc-800 dark:text-gray-300"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onDelete(entry.id);
                  setShowConfirm(false);
                }}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white scale97"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
