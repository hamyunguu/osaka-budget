"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, List, BarChart3, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/history", icon: List, label: "내역" },
  { href: "/input", icon: PlusCircle, label: "입력", accent: true },
  { href: "/stats", icon: BarChart3, label: "통계" },
  { href: "/settings", icon: Settings, label: "설정" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-zinc-900 dark:border-zinc-800">
      <div className="mx-auto flex max-w-[480px] items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ href, icon: Icon, label, accent }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-transform active:scale-95 ${
                accent
                  ? "relative -top-3"
                  : ""
              }`}
            >
              {accent ? (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg dark:bg-white dark:text-black">
                  <Icon size={24} />
                </span>
              ) : (
                <Icon
                  size={22}
                  className={active ? "text-black dark:text-white" : "text-gray-400"}
                />
              )}
              <span
                className={`text-[10px] ${
                  accent
                    ? "font-medium text-black dark:text-white"
                    : active
                      ? "font-medium text-black dark:text-white"
                      : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
