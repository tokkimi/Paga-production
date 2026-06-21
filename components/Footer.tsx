"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Send } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tCookies = useTranslations("home.newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const getLocalePath = (href: string) => `/${locale}${href}`;

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

  return (
    <footer className="border-t border-white/[0.06] pb-24 md:pb-0">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_.75fr_1.1fr]">

          {/* Brand */}
          <div>
            <Link href={getLocalePath("/")} className="block mb-5">
              <div className="text-xl font-black tracking-[0.15em] uppercase text-white">PAGA</div>
              <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-primary/70 mt-0.5">
                PRODUCTION
              </div>
            </Link>
            <p className="text-xs text-white/40 leading-relaxed mb-6">
              {t("description")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/paga_lmsa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white transition-colors tracking-wider"
              >
                Instagram ↗
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Artistes", href: "/artistes" },
                { label: "Dates", href: "/dates" },
                { label: "Sponsors", href: "/sponsors" },
                { label: "Rejoindre", href: "/rejoindre" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={getLocalePath(link.href)}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-white/5">
              <ul className="space-y-2">
                {[
                  { label: t("mentions"), href: "/mentions-legales" },
                  { label: t("privacy"), href: "/politique-confidentialite" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={getLocalePath(link.href)}
                      className="text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-5">
              Newsletter
            </h4>
            <p className="text-xs text-white/40 mb-4 leading-relaxed">
              Nouvelles dates et sorties directement dans votre boite mail.
            </p>
            {status === "success" ? (
              <p className="text-xs text-green-400/80">{tCookies("success")}</p>
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
                <button type="submit" className="btn-primary w-full text-sm py-3 justify-center">
                  <Send size={13} />
                  {t("newsletter_btn")}
                </button>
                {status === "error" && (
                  <p className="text-xs text-red-400/70">Une erreur est survenue.</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">{t("copyright")}</p>
          <p className="text-xs text-white/20">Made in the South of France</p>
        </div>
      </div>
    </footer>
  );
}

