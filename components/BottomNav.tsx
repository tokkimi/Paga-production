"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Users, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const locale = useLocale();

  const isDates = pathname.includes("/dates");
  const isArtistes = pathname.includes("/artistes");

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-[560px] rounded-[22px] md:bottom-5"
      style={{
        background: "rgba(5, 10, 20, 0.64)",
        backdropFilter: "blur(28px) saturate(145%)",
        WebkitBackdropFilter: "blur(28px) saturate(145%)",
        border: "1px solid rgba(125, 220, 255, 0.18)",
        boxShadow: "0 18px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="grid grid-cols-3 items-center gap-1 p-2">
        <Link
          href={`/${locale}/artistes`}
          className={cn(
            "flex min-w-0 items-center justify-center gap-2 rounded-2xl px-3 py-3 transition-all",
            isArtistes ? "bg-cyan-300/10 text-cyan-200" : "text-white/52 hover:bg-white/[0.05] hover:text-white"
          )}
        >
          <Users size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">Artistes</span>
        </Link>

        <Link
          href={`/${locale}/dates`}
          className={cn(
            "flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-3 py-3 transition-all",
            isDates
              ? "border-cyan-200/35 bg-cyan-300/18 text-cyan-100"
              : "border-cyan-200/20 bg-cyan-300/10 text-cyan-200 hover:bg-cyan-300/16"
          )}
        >
          <Calendar size={19} />
          <span className="text-[10px] font-black uppercase tracking-[0.12em] sm:text-xs">Dates</span>
        </Link>

        <Link
          href={`/${locale}#contact`}
          className="flex min-w-0 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-white/52 transition-all hover:bg-white/[0.05] hover:text-white"
        >
          <Mail size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">Contact</span>
        </Link>
      </div>
    </nav>
  );
}
