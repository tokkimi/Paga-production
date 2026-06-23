"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function Contact() {
  const locale = useLocale();
  const t = useTranslations("home.contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "booking", message: "" });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "booking", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-7 border-t border-white/[0.07] pt-12 text-left lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-cyan-300">Booking &amp; Pro</p>
            <h2 className="section-title">{t("title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{t("subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/sponsors`} className="btn-secondary text-sm">Brief marque</Link>
              <Link href={`/${locale}/rejoindre`} className="btn-secondary text-sm">Dossier artiste</Link>
            </div>
            <div className="mt-7 flex items-center gap-6">
              <a
                href="https://www.instagram.com/pagaproduction"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
              >
                <span className="text-xs font-black">IG</span>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/@pagaproduction"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
              >
                <span className="text-xs font-black">YT</span>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-white/60">{t("name")}</span>
                <input className="form-input" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-white/60">{t("email")}</span>
                <input className="form-input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-white/60">{t("subject")}</span>
              <select className="form-input" value={form.subject} onChange={(e) => update("subject", e.target.value)}>
                <option value="booking">Booking / programmation</option>
                <option value="brand">Marque / partenariat</option>
                <option value="artist">Artiste / management</option>
                <option value="press">Presse / media</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-white/60">{t("message")}</span>
              <textarea
                className="form-input min-h-32 resize-none"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                required
                placeholder="Date, ville, budget, artiste vise, objectifs..."
              />
            </label>
            <button type="submit" disabled={status === "loading"} className="btn-primary mt-5 w-full justify-center">
              <Send size={15} />
              {status === "loading" ? "Envoi..." : t("send")}
            </button>
            {status === "success" && (
              <p className="mt-4 flex items-center gap-2 text-sm text-green-400">
                <CheckCircle size={15} /> {t("success")}
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle size={15} /> {t("error")}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
