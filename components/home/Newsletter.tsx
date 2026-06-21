"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Newsletter() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 409) {
        setStatus("already");
        return;
      }

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
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-cyan-200/15 bg-white/[0.035] px-5 py-7 backdrop-blur-xl sm:px-8">
            <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">Paga updates</p>
                <h2 className="text-lg font-bold uppercase tracking-[0.08em]">{t("title")}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/48">{t("subtitle")}</p>
              </div>

              {status === "success" ? (
                <div className="flex items-center gap-3 text-green-400">
                  <CheckCircle size={20} />
                  <span>{t("success")}</span>
                </div>
              ) : status === "already" ? (
                <div className="flex items-center gap-3 text-yellow-400">
                  <CheckCircle size={20} />
                  <span>{t("already")}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    required
                    className="form-input min-w-0 flex-1"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary shrink-0 justify-center whitespace-nowrap"
                  >
                    {status === "loading" ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        {t("cta")}
                      </>
                    )}
                  </button>
                </form>
              )}

              {status === "error" && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-400 lg:col-start-2">
                  <AlertCircle size={16} />
                  {t("error")}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
