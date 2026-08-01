"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const locale = useLocale();

  const isDates = pathname.includes("/dates");
  const isArtistes = pathname.includes("/artistes");

  return (
    <nav
      className="md:hidden fixed bottom-4 left-4 right-4 z-50 rounded-2xl"
      style={{
        background: "rgba(249, 247, 245, 0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {/* Artistes */}
        <Link
          href={`/${locale}/artistes`}
          className={cn(
            "flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-colors",
            isArtistes ? "text-primary" : "text-foreground/40"
          )}
        >
          <Users size={20} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Artistes</span>
        </Link>

        {/* Dates — center, logo Sherrie Sherrie */}
        <Link
          href={`/${locale}/dates`}
          className="flex items-center justify-center px-3 py-1 rounded-xl"
          style={{
            border: "1.5px solid",
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

        {/* Contact */}
        <a
          href="mailto:booking@pagaproduction.fr"
          className="flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-colors text-foreground/40 hover:text-foreground"
        >
          <Mail size={20} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Contact</span>
        </a>
      </div>
    </nav>
  );
}
