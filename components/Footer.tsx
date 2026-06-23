"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Send } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tNewsletter = useTranslations("home.newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const getLocalePath = (href: string) => "/" + locale + href;

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
    { label: tNav("artists"), href: "/artistes" },
    { label: tNav("dates"), href: "/dates" },
    { label: tNav("sponsors"), href: "/sponsors" },
    { label: tNav("join"), href: "/rejoindre" },
  ];

  return (
    <footer className="border-t border-white/[0.06] pb-28">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_.75fr_1.1fr]">
          <div>
            <Link href={getLocalePath("/")} className="mb-5 block">
              <div className="text-xl font-black tracking-[0.15em] uppercase text-white">PAGA</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/70">
                PRODUCTION
              </div>
            </Link>
            <p className="mb-6 text-xs leading-relaxed text-white/40">{t("description")}</p>
            <a
              href="https://www.instagram.com/paga_lmsa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-wider text-white/40 transition-colors hover:text-white"
            >
              Instagram
            </a>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
              {t("links")}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={getLocalePath(link.href)} className="text-sm text-white/50 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/5 pt-6">
              <ul className="space-y-2">
                {[
                  { label: t("mentions"), href: "/mentions-legales" },
                  { label: t("privacy"), href: "/politique-confidentialite" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={getLocalePath(link.href)} className="text-xs text-white/30 transition-colors hover:text-white/60">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
              {t("newsletter")}
            </h4>
            <p className="mb-4 text-xs leading-relaxed text-white/40">{t("newsletter_desc")}</p>
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

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">{t("copyright")}</p>
          <p className="text-xs text-white/20">{t("made")}</p>
        </div>
      </div>
    </footer>
  );
}
