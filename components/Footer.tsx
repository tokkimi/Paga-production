"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const labels = {
  fr: {
    dates: "Dates",
    sponsors: "Sponsors",
    join: "Rejoindre",
    contact: "Contact",
    terms: "CGV",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    rights: "© 2026 Sherrie Sherrie. Tous droits réservés.",
  },
  en: {
    dates: "Dates",
    sponsors: "Sponsors",
    join: "Join",
    contact: "Contact",
    terms: "Terms",
    legal: "Legal notice",
    privacy: "Privacy",
    rights: "© 2026 Sherrie Sherrie. All rights reserved.",
  },
  ko: {
    dates: "일정",
    sponsors: "스폰서",
    join: "지원하기",
    contact: "문의",
    terms: "이용약관",
    legal: "법적 고지",
    privacy: "개인정보",
    rights: "© 2026 Sherrie Sherrie. 모든 권리 보유.",
  },
};

export default function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const text = labels[locale as keyof typeof labels] ?? labels.en;

  if (pathname === `/${locale}` || pathname === `/${locale}/`) return null;

  const links = [
    { label: text.dates, href: `/${locale}/dates` },
    { label: text.sponsors, href: `/${locale}/sponsors` },
    { label: text.join, href: `/${locale}/rejoindre` },
    { label: text.contact, href: `/${locale}#contact` },
    { label: text.terms, href: `/${locale}/cgv` },
    { label: text.legal, href: `/${locale}/mentions-legales` },
    { label: text.privacy, href: `/${locale}/politique-confidentialite` },
  ];

  return (
    <footer className="sherrie-footer-zone px-4 pb-36 pt-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="sherrie-legal-strip px-4 py-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.62em] text-[#d85e98]/80">
            Music is our freedom
          </p>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.34em] opacity-58">
            House · Indie House · Melodic House · Techno
          </p>
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-black uppercase tracking-[0.18em]">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="opacity-58 transition hover:opacity-100">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-8 text-xs opacity-42">{text.rights}</p>
        </div>
      </div>
    </footer>
  );
}
