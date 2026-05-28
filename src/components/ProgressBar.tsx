"use client";

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
  showPercent?: boolean;
}

export default function ProgressBar({ label, value, color, showPercent = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        {showPercent && (
          <span className="font-medium" style={{ color }}>
            {Math.round(value)}%
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
