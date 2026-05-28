export const CATEGORIES = {
  food: { label: "식비", emoji: "🍚", color: "#1D9E75" },
  cafe: { label: "카페", emoji: "☕", color: "#BA7517" },
  transport: { label: "교통", emoji: "🚌", color: "#378ADD" },
  shopping: { label: "쇼핑", emoji: "🛒", color: "#D4537E" },
  etc: { label: "기타", emoji: "📦", color: "#888780" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_KEYS: CategoryKey[] = ["food", "cafe", "transport", "shopping", "etc"];

export const DEFAULT_CONFIG = {
  accountBalance: 200000,
  salary: 500000,
  scholarship: 300000,
  allowance: 150000,
  parentSupport: 200000,
  taxRefund: 120000,
  includeRefund: false,
  freelanceIncome: 0,
  fixedCost: 110000,
  cardBill: 150000,
  tripTarget: 800000,
  yenOnHand: 9500,
  startDate: "2026-05-28",
  endDate: "2026-06-29",
};

export const STORAGE_KEYS = {
  entries: "osaka-budget-entries",
  config: "osaka-budget-config",
} as const;
