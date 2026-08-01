"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tContact = useTranslations("home.contact");

  if (pathname === `/${locale}` || pathname === `/${locale}/`) return null;

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
          href={"/" + locale + "/artistes"}
          className={cn(
            "flex min-w-0 items-center justify-center gap-2 rounded-2xl px-3 py-3 transition-all",
            isArtistes ? "bg-cyan-300/10 text-cyan-200" : "text-white/52 hover:bg-white/[0.05] hover:text-white"
          )}
        >
          <Users size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">{tNav("artists")}</span>
        </Link>

        <Link
          href={"/" + locale + "/dates"}
          className="flex min-w-0 items-center justify-center rounded-2xl border px-3 py-2 transition-all"
          style={{
            border: "1.5px solid rgba(125, 220, 255, 0.35)",
            animation: "neonCycle 3.5s ease-in-out infinite",
          }}
        >
          <Image
            src="/sherrie-sherrie.png"
            alt="Sherrie Sherrie"
            width={90}
            height={46}
            className="object-contain"
            priority
          />
        </Link>

        <Link
          href={"/" + locale + "#contact"}
          className="flex min-w-0 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-white/52 transition-all hover:bg-white/[0.05] hover:text-white"
        >
          <Mail size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">{tContact("title")}</span>
        </Link>
      </div>
    </nav>
  );
}
