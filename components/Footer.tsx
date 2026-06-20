"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Share2, Music, Play, Send } from "lucide-react";

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
    <footer className="border-t border-white/10 bg-black/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link href={getLocalePath("/")} className="block mb-4">
              <div className="text-2xl font-black tracking-[0.15em] uppercase text-white">
                PAGA
              </div>
              <div className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
                PRODUCTION
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              {t("description")}
            </p>

            {/* Social Links */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Paga
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/paga_lmsa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                >
                  <Share2 size={16} className="text-white/70" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                >
                  <Music size={16} className="text-white/70" />
                </a>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 mt-4">
                Alexis Dante
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/alexis.dante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                >
                  <Share2 size={16} className="text-white/70" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                >
                  <Play size={16} className="text-white/70" />
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              {t("links")}
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
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              {t("legal")}
            </h4>
            <ul className="space-y-3">
              {[
                { label: t("cgv"), href: "/cgv" },
                { label: t("mentions"), href: "/mentions-legales" },
                { label: t("privacy"), href: "/politique-confidentialite" },
                { label: t("cookies"), href: "/cookies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={getLocalePath(link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">
              {t("newsletter")}
            </h4>
            <p className="text-sm text-white/60 mb-4">
              Soyez les premiers informés des nouvelles dates et sorties.
            </p>
            {status === "success" ? (
              <div className="glass-card p-4 rounded-xl text-center">
                <p className="text-sm text-green-400">
                  {tCookies("success")}
                </p>
              </div>
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
                <button
                  type="submit"
                  className="btn-primary w-full text-sm py-3 justify-center"
                >
                  <Send size={14} />
                  {t("newsletter_btn")}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">{t("copyright")}</p>
          <p className="text-sm text-white/40">
            Made with ♥ in the South of France
          </p>
        </div>
      </div>
    </footer>
  );
}
