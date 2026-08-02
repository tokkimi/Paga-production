"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const tContact = useTranslations("home.contact");

  if (pathname === `/${locale}` || pathname === `/${locale}/`) return null;

  const isDates = pathname.includes("/dates");

  return (
    <nav className="sherrie-floating-nav fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-3">
      <div className="mx-auto grid w-[min(92vw,500px)] grid-cols-3 items-center gap-1">
        <Link
          href={"/" + locale + "/dates"}
          className={cn(
            "sherrie-nav-button flex min-w-0 items-center justify-center gap-2 px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition-all",
            isDates && "sherrie-nav-button-active"
          )}
        >
          <CalendarDays size={16} />
          <span>Dates</span>
        </Link>

        <Link
          href={"/" + locale}
          aria-label="Sherrie Sherrie"
          className="relative flex h-20 min-w-0 items-center justify-center"
        >
          <span className="absolute h-16 w-36 rounded-full bg-[#ef6aa4]/18 blur-2xl" />
          <img src="/sherrie-sherrie.png" alt="Sherrie Sherrie" className="relative h-24 w-auto max-w-[230px] object-contain drop-shadow-[0_0_28px_rgba(239,106,164,.30)]" />
        </Link>

        <Link
          href={"/" + locale + "#contact"}
          className="sherrie-nav-button flex min-w-0 items-center justify-center gap-2 px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition-all"
        >
          <span>{tContact("title")}</span>
          <Mail size={16} />
        </Link>
      </div>
    </nav>
  );
}
