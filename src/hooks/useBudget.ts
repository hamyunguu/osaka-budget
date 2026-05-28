"use client";

import { useState, useEffect, useCallback } from "react";
import type { BudgetConfig } from "@/lib/types";
import { getConfig, setConfig } from "@/lib/storage";

export function useBudget() {
  const [config, setConfigState] = useState<BudgetConfig | null>(null);

  useEffect(() => {
    setConfigState(getConfig());
  }, []);

  const updateConfig = useCallback((partial: Partial<BudgetConfig>) => {
    const current = getConfig();
    const next = { ...current, ...partial };
    setConfigState(next);
    setConfig(next);
  }, []);

  const resetConfig = useCallback(() => {
    const { DEFAULT_CONFIG } = require("@/lib/constants");
    setConfigState({ ...DEFAULT_CONFIG });
    setConfig({ ...DEFAULT_CONFIG });
  }, []);

  return { config, updateConfig, resetConfig };
}
