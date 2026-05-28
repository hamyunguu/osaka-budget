"use client";

import { CATEGORIES, CATEGORY_KEYS, type CategoryKey } from "@/lib/constants";

interface CategoryPickerProps {
  selected: CategoryKey;
  onChange: (cat: CategoryKey) => void;
}

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  return (
    <div className="flex gap-2">
      {CATEGORY_KEYS.map((key) => {
        const cat = CATEGORIES[key];
        const active = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-3 text-xs font-medium transition-all active:scale-95 ${
              active
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "bg-[#F7F7F5] text-gray-600 dark:bg-zinc-800 dark:text-gray-300"
            }`}
          >
            <span className="text-lg">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
