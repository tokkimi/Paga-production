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
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-10 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Send size={24} className="text-primary" />
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tight mb-3">
                {t("title")}
              </h2>
              <p className="text-white/60 mb-8 text-sm">{t("subtitle")}</p>

              {status === "success" ? (
                <div className="flex items-center justify-center gap-3 text-green-400">
                  <CheckCircle size={20} />
                  <span>{t("success")}</span>
                </div>
              ) : status === "already" ? (
                <div className="flex items-center justify-center gap-3 text-yellow-400">
                  <CheckCircle size={20} />
                  <span>{t("already")}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    required
                    className="form-input flex-1"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary whitespace-nowrap justify-center"
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
                <div className="flex items-center justify-center gap-2 text-red-400 mt-3 text-sm">
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
