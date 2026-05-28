"use client";

import { useEntries } from "@/hooks/useEntries";
import { useBudget } from "@/hooks/useBudget";
import MetricCard from "@/components/MetricCard";
import ProgressBar from "@/components/ProgressBar";
import { CATEGORIES } from "@/lib/constants";
import {
  calcRemaining,
  calcDailyBudget,
  calcDaysLeft,
  calcSpendingRate,
  calcTimeRate,
  calcPaceStatus,
  getTodayEntries,
  calcTotalSpent,
  calcLivingBudget,
} from "@/lib/budget";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

const PACE_LABELS = {
  good: { text: "양호", color: "#1D9E75", bg: "bg-green-50 dark:bg-green-950/30" },
  caution: { text: "주의", color: "#BA7517", bg: "bg-amber-50 dark:bg-amber-950/30" },
  over: { text: "초과 페이스", color: "#E24B4A", bg: "bg-red-50 dark:bg-red-950/30" },
};

export default function HomePage() {
  const { entries, loaded } = useEntries();
  const { config } = useBudget();

  if (!loaded || !config) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-zinc-600 dark:border-t-white" />
      </div>
    );
  }

  const remaining = calcRemaining(config, entries);
  const dailyBudget = calcDailyBudget(config, entries);
  const daysLeft = calcDaysLeft(config);
  const spendRate = calcSpendingRate(config, entries);
  const timeRate = calcTimeRate(config);
  const pace = calcPaceStatus(config, entries);
  const paceInfo = PACE_LABELS[pace];
  const todayEntries = getTodayEntries(entries);
  const todayTotal = todayEntries.reduce((s, e) => s + e.amount, 0);
  const totalSpent = calcTotalSpent(entries);
  const budget = calcLivingBudget(config);

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="text-lg font-bold">오사카 여행 생활비</h1>
      <p className="mt-0.5 text-xs text-gray-400">
        D-{daysLeft} · 출발까지 {daysLeft}일
      </p>

      {/* Metric cards */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <MetricCard
          label="남은 생활비"
          value={formatMoney(remaining)}
          color={remaining >= 0 ? "#1D9E75" : "#E24B4A"}
        />
        <MetricCard
          label="하루 예산"
          value={formatMoney(Math.max(0, dailyBudget))}
          color="#378ADD"
          sub={`${daysLeft}일 남음`}
        />
        <MetricCard
          label="총 지출"
          value={formatMoney(totalSpent)}
          color="#111111"
          sub={`/ ${formatMoney(budget)}`}
        />
      </div>

      {/* Progress bars */}
      <div className="mt-5 space-y-3 rounded-2xl bg-[#F7F7F5] p-4 dark:bg-zinc-800">
        <ProgressBar
          label="지출률"
          value={spendRate}
          color={spendRate > 80 ? "#E24B4A" : spendRate > 60 ? "#BA7517" : "#1D9E75"}
        />
        <ProgressBar
          label="시간 경과"
          value={timeRate}
          color="#378ADD"
        />
        <div className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 ${paceInfo.bg}`}>
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: paceInfo.color }}
          />
          <span className="text-xs font-medium" style={{ color: paceInfo.color }}>
            {paceInfo.text}
          </span>
          <span className="text-[11px] text-gray-400">
            지출 {Math.round(spendRate)}% · 시간 {Math.round(timeRate)}%
          </span>
        </div>
      </div>

      {/* Today summary */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">오늘의 지출</h2>
          <span className="text-sm font-bold" style={{ color: todayTotal > dailyBudget ? "#E24B4A" : "#111" }}>
            {formatMoney(todayTotal)}
          </span>
        </div>

        {todayEntries.length === 0 ? (
          <p className="mt-3 text-center text-xs text-gray-400 py-6">
            아직 오늘 지출이 없어요
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {todayEntries.map((entry) => {
              const cat = CATEGORIES[entry.category];
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl bg-[#F7F7F5] px-4 py-3 dark:bg-zinc-800"
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {entry.memo || cat.label}
                  </span>
                  <span className="text-sm font-semibold">
                    {formatMoney(entry.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick add button */}
      <Link
        href="/input"
        className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-sm font-medium text-white shadow-sm transition-transform scale97 dark:bg-white dark:text-black"
      >
        <Plus size={18} />
        지출 기록하기
      </Link>
    </div>
  );
}
