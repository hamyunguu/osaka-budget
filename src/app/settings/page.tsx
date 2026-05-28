"use client";

import { useState } from "react";
import { useBudget } from "@/hooks/useBudget";
import { clearAll, exportData } from "@/lib/storage";
import { toast } from "@/components/Toast";
import { formatMoney } from "@/lib/utils";
import { calcLivingBudget } from "@/lib/budget";
import { Download, Trash2, ChevronRight } from "lucide-react";

function NumberField({
  label,
  value,
  onChange,
  suffix = "원",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-medium outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-white"
        />
        <span className="text-xs text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { config, updateConfig } = useBudget();
  const [showReset, setShowReset] = useState(false);

  if (!config) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-zinc-600 dark:border-t-white" />
      </div>
    );
  }

  const budget = calcLivingBudget(config);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `osaka-budget-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("데이터 내보내기 완료");
  };

  const handleReset = () => {
    clearAll();
    window.location.reload();
  };

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="text-lg font-bold">설정</h1>

      {/* Budget summary */}
      <div className="mt-4 rounded-2xl bg-[#F7F7F5] p-4 dark:bg-zinc-800">
        <p className="text-xs text-gray-400">현재 생활비 한도</p>
        <p className="mt-1 text-2xl font-bold" style={{ color: budget >= 0 ? "#1D9E75" : "#E24B4A" }}>
          {formatMoney(budget)}
        </p>
        <p className="mt-0.5 text-[11px] text-gray-400">
          {config.includeRefund ? "환급 포함" : "환급 미포함"}
        </p>
      </div>

      {/* Refund toggle */}
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F7F7F5] px-4 py-3 dark:bg-zinc-800">
        <div>
          <p className="text-sm font-medium">소득세 환급 포함</p>
          <p className="text-[11px] text-gray-400">
            {formatMoney(config.taxRefund)} · 7월 1일 이후 입금 예정
          </p>
        </div>
        <button
          onClick={() => updateConfig({ includeRefund: !config.includeRefund })}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            config.includeRefund ? "bg-green-500" : "bg-gray-300 dark:bg-zinc-600"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
              config.includeRefund ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Income section */}
      <div className="mt-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">수입</h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-2xl bg-[#F7F7F5] px-4 dark:divide-zinc-700 dark:bg-zinc-800">
          <NumberField label="계좌 잔액" value={config.accountBalance} onChange={(v) => updateConfig({ accountBalance: v })} />
          <NumberField label="월급" value={config.salary} onChange={(v) => updateConfig({ salary: v })} />
          <NumberField label="장학금" value={config.scholarship} onChange={(v) => updateConfig({ scholarship: v })} />
          <NumberField label="용돈" value={config.allowance} onChange={(v) => updateConfig({ allowance: v })} />
          <NumberField label="부모님 여행비" value={config.parentSupport} onChange={(v) => updateConfig({ parentSupport: v })} />
          <NumberField label="소득세 환급" value={config.taxRefund} onChange={(v) => updateConfig({ taxRefund: v })} />
          <NumberField label="외주 수입 (누적)" value={config.freelanceIncome} onChange={(v) => updateConfig({ freelanceIncome: v })} />
        </div>
      </div>

      {/* Fixed expenses */}
      <div className="mt-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">고정 지출</h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-2xl bg-[#F7F7F5] px-4 dark:divide-zinc-700 dark:bg-zinc-800">
          <NumberField label="고정비" value={config.fixedCost} onChange={(v) => updateConfig({ fixedCost: v })} />
          <NumberField label="카드값" value={config.cardBill} onChange={(v) => updateConfig({ cardBill: v })} />
        </div>
      </div>

      {/* Trip target */}
      <div className="mt-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">여행</h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-2xl bg-[#F7F7F5] px-4 dark:divide-zinc-700 dark:bg-zinc-800">
          <NumberField label="여행 자금 목표" value={config.tripTarget} onChange={(v) => updateConfig({ tripTarget: v })} />
          <NumberField label="보유 엔화" value={config.yenOnHand} onChange={(v) => updateConfig({ yenOnHand: v })} suffix="엔" />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 space-y-2">
        <button
          onClick={handleExport}
          className="flex w-full items-center justify-between rounded-2xl bg-[#F7F7F5] px-4 py-3.5 text-sm font-medium scale97 dark:bg-zinc-800"
        >
          <span className="flex items-center gap-2">
            <Download size={16} className="text-gray-400" />
            데이터 내보내기 (JSON)
          </span>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <button
          onClick={() => setShowReset(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-[#F7F7F5] px-4 py-3.5 text-sm font-medium text-red-500 scale97 dark:bg-zinc-800"
        >
          <span className="flex items-center gap-2">
            <Trash2 size={16} />
            전체 초기화
          </span>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </div>

      {/* Reset modal */}
      {showReset && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40" onClick={() => setShowReset(false)}>
          <div className="mx-6 w-full max-w-[320px] rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <p className="text-center text-sm font-medium">모든 데이터를 삭제할까요?</p>
            <p className="mt-1 text-center text-xs text-gray-400">
              지출 기록과 설정이 모두 초기화됩니다
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-600 scale97 dark:bg-zinc-800 dark:text-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white scale97"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
