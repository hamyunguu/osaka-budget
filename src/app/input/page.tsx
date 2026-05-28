"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEntries } from "@/hooks/useEntries";
import CategoryPicker from "@/components/CategoryPicker";
import { toast } from "@/components/Toast";
import { getTodayString } from "@/lib/utils";
import type { CategoryKey } from "@/lib/constants";
import { Delete, Check } from "lucide-react";

const NUMPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"];

export default function InputPage() {
  const router = useRouter();
  const { addEntry } = useEntries();
  const [category, setCategory] = useState<CategoryKey>("food");
  const [amount, setAmount] = useState("0");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(getTodayString());

  const handleNumpad = (key: string) => {
    if (key === "del") {
      setAmount((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
    } else {
      setAmount((prev) => {
        const next = prev === "0" ? key : prev + key;
        if (next.length > 8) return prev;
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const num = parseInt(amount, 10);
    if (num <= 0) return;
    addEntry(date, category, num, memo);
    toast("기록 완료");
    router.push("/");
  };

  const displayAmount = parseInt(amount, 10).toLocaleString("ko-KR");
  const hasAmount = parseInt(amount, 10) > 0;

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-14 pb-4">
      <h1 className="text-lg font-bold">지출 입력</h1>

      {/* Date picker */}
      <div className="mt-4">
        <input
          type="date"
          value={date}
          min="2026-05-28"
          max="2026-06-29"
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-[#F7F7F5] px-4 py-2.5 text-sm text-gray-700 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
        />
      </div>

      {/* Category picker */}
      <div className="mt-4">
        <CategoryPicker selected={category} onChange={setCategory} />
      </div>

      {/* Amount display */}
      <div className="mt-5 rounded-2xl bg-[#F7F7F5] py-5 dark:bg-zinc-800">
        {!hasAmount && (
          <p className="text-center text-xs text-gray-400 mb-1">아래 키패드로 금액을 입력하세요</p>
        )}
        <div className="text-center">
          <span className="text-4xl font-bold tracking-tight">{displayAmount}</span>
          <span className="ml-1 text-lg text-gray-400">원</span>
        </div>
      </div>

      {/* Numpad */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {NUMPAD.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleNumpad(key)}
            className="flex h-13 items-center justify-center rounded-xl bg-[#F7F7F5] text-lg font-medium text-gray-800 transition-all active:scale-95 active:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:active:bg-zinc-700"
          >
            {key === "del" ? <Delete size={20} /> : key}
          </button>
        ))}
      </div>

      {/* Memo */}
      <div className="mt-3">
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모 (선택사항)"
          maxLength={30}
          className="w-full rounded-xl border border-gray-200 bg-[#F7F7F5] px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!hasAmount}
        className="mt-3 mb-4 flex items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-sm font-medium text-white shadow-sm transition-transform scale97 disabled:opacity-30 dark:bg-white dark:text-black"
      >
        <Check size={18} />
        기록하기
      </button>
    </div>
  );
}
