"use client";

import { useEffect, useState } from "react";

let showToastFn: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  showToastFn?.(msg);
}

export default function ToastContainer() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    showToastFn = (msg: string) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    };
    return () => {
      showToastFn = null;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 animate-slide-up">
      <div className="rounded-full bg-black/80 px-5 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-white/90 dark:text-black">
        {message}
      </div>
    </div>
  );
}
