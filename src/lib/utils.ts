export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  return sign + abs.toLocaleString("ko-KR") + "원";
}

export function formatMoneyShort(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 10000) {
    const man = Math.floor(abs / 10000);
    const rest = abs % 10000;
    if (rest === 0) return `${sign}${man}만원`;
    return `${sign}${man}만 ${rest.toLocaleString("ko-KR")}원`;
  }
  return sign + abs.toLocaleString("ko-KR") + "원";
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDateKR(dateStr: string): string {
  const d = parseDate(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[d.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

export function getTodayString(): string {
  return toDateString(new Date());
}
