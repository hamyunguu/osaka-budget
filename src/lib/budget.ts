import type { BudgetConfig, Entry } from "./types";
import { daysBetween, getTodayString } from "./utils";

export function calcTotalIncome(config: BudgetConfig): number {
  let total =
    config.accountBalance +
    config.salary +
    config.scholarship +
    config.allowance +
    config.parentSupport +
    config.freelanceIncome;
  if (config.includeRefund) {
    total += config.taxRefund;
  }
  return total;
}

export function calcFixedExpenses(config: BudgetConfig): number {
  return config.fixedCost + config.cardBill;
}

export function calcLivingBudget(config: BudgetConfig): number {
  return calcTotalIncome(config) - calcFixedExpenses(config) - config.tripTarget;
}

export function calcTotalSpent(entries: Entry[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

export function calcRemaining(config: BudgetConfig, entries: Entry[]): number {
  return calcLivingBudget(config) - calcTotalSpent(entries);
}

export function calcDaysLeft(config: BudgetConfig): number {
  const today = getTodayString();
  const left = daysBetween(today, config.endDate);
  return Math.max(0, left);
}

export function calcTotalDays(config: BudgetConfig): number {
  return daysBetween(config.startDate, config.endDate);
}

export function calcElapsedDays(config: BudgetConfig): number {
  const today = getTodayString();
  const elapsed = daysBetween(config.startDate, today);
  return Math.max(0, Math.min(elapsed, calcTotalDays(config)));
}

export function calcDailyBudget(config: BudgetConfig, entries: Entry[]): number {
  const remaining = calcRemaining(config, entries);
  const daysLeft = calcDaysLeft(config);
  if (daysLeft <= 0) return 0;
  return Math.floor(remaining / daysLeft);
}

export function calcSpendingRate(config: BudgetConfig, entries: Entry[]): number {
  const budget = calcLivingBudget(config);
  if (budget <= 0) return 100;
  return (calcTotalSpent(entries) / budget) * 100;
}

export function calcTimeRate(config: BudgetConfig): number {
  const total = calcTotalDays(config);
  if (total <= 0) return 100;
  return (calcElapsedDays(config) / total) * 100;
}

export type PaceStatus = "good" | "caution" | "over";

export function calcPaceStatus(config: BudgetConfig, entries: Entry[]): PaceStatus {
  const spendRate = calcSpendingRate(config, entries);
  const timeRate = calcTimeRate(config);
  const diff = spendRate - timeRate;
  if (diff > 10) return "over";
  if (diff > 0) return "caution";
  return "good";
}

export function calcCategoryTotals(entries: Entry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const e of entries) {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  }
  return totals;
}

export function calcDailyTotals(entries: Entry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const e of entries) {
    totals[e.date] = (totals[e.date] || 0) + e.amount;
  }
  return totals;
}

export function getTodayEntries(entries: Entry[]): Entry[] {
  const today = getTodayString();
  return entries.filter((e) => e.date === today);
}
