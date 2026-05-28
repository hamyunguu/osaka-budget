"use client";

interface MetricCardProps {
  label: string;
  value: string;
  color?: string;
  sub?: string;
}

export default function MetricCard({ label, value, color, sub }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-[#F7F7F5] px-3 py-4 dark:bg-zinc-800">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="mt-1 text-xl font-bold" style={{ color }}>
        {value}
      </span>
      {sub && <span className="mt-0.5 text-[11px] text-gray-400">{sub}</span>}
    </div>
  );
}
