import type { CategoryKey } from "./constants";

export interface Entry {
  id: string;
  date: string;
  category: CategoryKey;
  amount: number;
  memo?: string;
  createdAt: string;
}

export interface BudgetConfig {
  accountBalance: number;
  salary: number;
  scholarship: number;
  allowance: number;
  parentSupport: number;
  taxRefund: number;
  includeRefund: boolean;
  freelanceIncome: number;
  fixedCost: number;
  cardBill: number;
  tripTarget: number;
  yenOnHand: number;
  startDate: string;
  endDate: string;
}
