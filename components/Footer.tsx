"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Send } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tNewsletter = useTranslations("home.newsletter");
  const locale = useLocale();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const getLocalePath = (href: string) => "/" + locale + href;

  if (pathname === `/${locale}` || pathname === `/${locale}/`) return null;

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 201) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const links = [
    { label: tNav("dates"), href: "/dates" },
    { label: tNav("sponsors"), href: "/sponsors" },
    { label: tNav("join"), href: "/rejoindre" },
  ];

  return (
    <footer className="sherrie-page border-t border-[#111118]/10 pb-28">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_.85fr_1.15fr]">
          <div className="rounded-[22px] bg-white/62 p-5 shadow-[0_18px_58px_rgba(30,24,28,.08)]">
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#aa5d74]">Newsletter</h4>
            <p className="text-sm leading-relaxed text-[#111118]/58">{t("newsletter_desc")}</p>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#111118]/35">
              {t("links")}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={getLocalePath(link.href)} className="text-sm text-[#111118]/58 transition-colors hover:text-[#111118]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-[#111118]/10 pt-6">
              <ul className="space-y-2">
                {[
                  { label: t("mentions"), href: "/mentions-legales" },
                  { label: t("privacy"), href: "/politique-confidentialite" },
                  { label: "CGV", href: "/cgv" },
                  { label: "Cookies", href: "/cookies" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={getLocalePath(link.href)} className="text-xs text-[#111118]/42 transition-colors hover:text-[#111118]/70">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#111118]/35">
              {t("newsletter")}
            </h4>
            <p className="mb-4 text-xs leading-relaxed text-[#111118]/50">{t("newsletter_desc")}</p>
            {status === "success" ? (
              <p className="text-xs text-green-400/80">{tNewsletter("success")}</p>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter_placeholder")}
                  required
                  className="form-input text-sm"
                />
                <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                  <Send size={13} />
                  {t("newsletter_btn")}
                </button>
                {status === "error" && <p className="text-xs text-red-400/70">{t("newsletter_error")}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#111118]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#111118]/35">{t("copyright")}</p>
          <p className="text-xs text-[#111118]/30">{t("made")}</p>
        </div>
      </div>
    </footer>
  );
}
