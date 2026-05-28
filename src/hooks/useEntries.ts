"use client";

import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import type { Entry } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";
import { getEntries, setEntries } from "@/lib/storage";

export function useEntries() {
  const [entries, setEntriesState] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntriesState(getEntries());
    setLoaded(true);
  }, []);

  const save = useCallback((next: Entry[]) => {
    setEntriesState(next);
    setEntries(next);
  }, []);

  const addEntry = useCallback(
    (date: string, category: CategoryKey, amount: number, memo?: string) => {
      const entry: Entry = {
        id: nanoid(),
        date,
        category,
        amount,
        memo: memo || undefined,
        createdAt: new Date().toISOString(),
      };
      const next = [...getEntries(), entry];
      save(next);
      return entry;
    },
    [save],
  );

  const removeEntry = useCallback(
    (id: string) => {
      const next = getEntries().filter((e) => e.id !== id);
      save(next);
    },
    [save],
  );

  return { entries, loaded, addEntry, removeEntry };
}
