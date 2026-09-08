import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-red/40 bg-red/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-red-soft shadow-[0_0_16px_rgba(237,27,63,0.16)]">
      {children}
    </span>
  );
}
