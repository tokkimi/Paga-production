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
      className="fixed bottom-3 left-3 right-3 z-50 rounded-2xl md:hidden"
      style={{
        background: "rgba(4, 6, 14, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
      }}
    >
      <div className="grid grid-cols-3 items-center px-2 py-2">
        <Link
          href={`/${locale}/artistes`}
          className={cn(
            "flex min-w-0 flex-col items-center gap-1 rounded-xl px-2 py-1 transition-colors",
            isArtistes ? "text-primary" : "text-white/50"
          )}
        >
          <Users size={20} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Artistes</span>
        </Link>

        <Link
          href={`/${locale}/dates`}
          className="mx-auto flex min-w-[84px] flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all"
          style={{
            background: isDates ? "rgba(59, 130, 246, 0.25)" : "rgba(59, 130, 246, 0.12)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
          }}
        >
          <Calendar size={22} className="text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Dates</span>
        </Link>

        <a
          href="mailto:booking@pagaproduction.fr"
          className="flex min-w-0 flex-col items-center gap-1 rounded-xl px-2 py-1 text-white/50 transition-colors hover:text-white"
        >
          <Mail size={20} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Contact</span>
        </a>
      </div>
    </nav>
  );
}
