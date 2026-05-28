"use client";

import { useMemo } from "react";
import { useEntries } from "@/hooks/useEntries";
import { useBudget } from "@/hooks/useBudget";
import { CATEGORIES, CATEGORY_KEYS } from "@/lib/constants";
import {
  calcCategoryTotals,
  calcDailyTotals,
  calcTotalSpent,
  calcDailyBudget,
} from "@/lib/budget";
import { formatMoney, formatDateKR, daysBetween } from "@/lib/utils";

export default function StatsPage() {
  const { entries, loaded } = useEntries();
  const { config } = useBudget();

  const categoryTotals = useMemo(() => calcCategoryTotals(entries), [entries]);
  const dailyTotals = useMemo(() => calcDailyTotals(entries), [entries]);
  const totalSpent = useMemo(() => calcTotalSpent(entries), [entries]);

  const dailyBudgetLine = config ? calcDailyBudget(config, entries) : 0;

  const sortedDays = useMemo(() => {
    return Object.entries(dailyTotals).sort(([a], [b]) => a.localeCompare(b));
  }, [dailyTotals]);

  const maxDailySpend = useMemo(() => {
    return Math.max(...Object.values(dailyTotals), dailyBudgetLine, 1);
  }, [dailyTotals, dailyBudgetLine]);

  const topCategory = useMemo(() => {
    let max = 0;
    let key = "";
    for (const [k, v] of Object.entries(categoryTotals)) {
      if (v > max) { max = v; key = k; }
    }
    return key;
  }, [categoryTotals]);

  const topDay = useMemo(() => {
    let max = 0;
    let date = "";
    for (const [d, v] of Object.entries(dailyTotals)) {
      if (v > max) { max = v; date = d; }
    }
    return date;
  }, [dailyTotals]);

  const weeklyTotals = useMemo(() => {
    if (!config) return [];
    const weeks: { label: string; total: number }[] = [];
    const start = config.startDate;
    for (const entry of entries) {
      const weekIdx = Math.floor(daysBetween(start, entry.date) / 7);
      if (!weeks[weekIdx]) {
        weeks[weekIdx] = { label: `${weekIdx + 1}주차`, total: 0 };
      }
      weeks[weekIdx].total += entry.amount;
    }
    return weeks.filter(Boolean);
  }, [entries, config]);

  const maxWeekly = useMemo(() => {
    return Math.max(...weeklyTotals.map((w) => w.total), 1);
  }, [weeklyTotals]);

  if (!loaded || !config) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-zinc-600 dark:border-t-white" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="px-5 pt-14">
        <h1 className="text-lg font-bold">통계</h1>
        <div className="mt-16 text-center">
          <p className="text-3xl">📊</p>
          <p className="mt-2 text-sm text-gray-400">데이터가 쌓이면 통계를 보여드릴게요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="text-lg font-bold">통계</h1>

      {/* Highlights */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {topCategory && (
          <div className="rounded-2xl bg-[#F7F7F5] p-4 dark:bg-zinc-800">
            <p className="text-xs text-gray-400">가장 많이 쓴 카테고리</p>
            <p className="mt-1 text-lg font-bold">
              {CATEGORIES[topCategory as keyof typeof CATEGORIES]?.emoji}{" "}
              {CATEGORIES[topCategory as keyof typeof CATEGORIES]?.label}
            </p>
            <p className="text-xs text-gray-500">
              {formatMoney(categoryTotals[topCategory] || 0)}
            </p>
          </div>
        )}
        {topDay && (
          <div className="rounded-2xl bg-[#F7F7F5] p-4 dark:bg-zinc-800">
            <p className="text-xs text-gray-400">가장 많이 쓴 날</p>
            <p className="mt-1 text-sm font-bold">{formatDateKR(topDay)}</p>
            <p className="text-xs text-gray-500">
              {formatMoney(dailyTotals[topDay] || 0)}
            </p>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div className="mt-5">
        <h2 className="text-sm font-bold">카테고리별 지출</h2>
        <div className="mt-3 space-y-3">
          {CATEGORY_KEYS.map((key) => {
            const amount = categoryTotals[key] || 0;
            const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            const cat = CATEGORIES[key];
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-300">
                    {cat.emoji} {cat.label}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatMoney(amount)}
                    <span className="ml-1 text-gray-400">({Math.round(pct)}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily chart */}
      <div className="mt-6">
        <h2 className="text-sm font-bold">일별 지출 추이</h2>
        <div className="mt-3 flex items-end gap-1 overflow-x-auto pb-2" style={{ minHeight: 140 }}>
          {sortedDays.map(([date, total]) => {
            const heightPct = (total / maxDailySpend) * 100;
            const budgetPct = (dailyBudgetLine / maxDailySpend) * 100;
            const overBudget = total > dailyBudgetLine && dailyBudgetLine > 0;
            const d = new Date(date);
            return (
              <div key={date} className="flex flex-col items-center" style={{ minWidth: 28 }}>
                <div className="relative flex h-24 w-5 items-end">
                  {dailyBudgetLine > 0 && (
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-blue-300"
                      style={{ bottom: `${budgetPct}%` }}
                    />
                  )}
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: overBudget ? "#E24B4A" : "#1D9E75",
                      minHeight: total > 0 ? 2 : 0,
                    }}
                  />
                </div>
                <span className="mt-1 text-[9px] text-gray-400">
                  {d.getMonth() + 1}/{d.getDate()}
                </span>
              </div>
            );
          })}
        </div>
        {dailyBudgetLine > 0 && (
          <p className="text-[10px] text-gray-400">
            점선 = 하루 예산 ({formatMoney(dailyBudgetLine)})
          </p>
        )}
      </div>

      {/* Weekly comparison */}
      {weeklyTotals.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-bold">주간 비교</h2>
          <div className="mt-3 space-y-2">
            {weeklyTotals.map((week) => {
              const pct = (week.total / maxWeekly) * 100;
              return (
                <div key={week.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{week.label}</span>
                    <span className="font-medium">{formatMoney(week.total)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-black transition-all duration-500 dark:bg-white"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
