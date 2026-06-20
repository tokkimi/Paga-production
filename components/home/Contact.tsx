"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail } from "lucide-react";

export default function Contact() {
  const t = useTranslations("home.contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok || res.status === 201) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
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
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">
            Booking & Pro
          </p>
          <h2 className="section-title mb-4">{t("title")}</h2>
          <p className="text-white/60 text-sm">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          {status === "success" ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <p className="text-green-400 font-medium">{t("success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">
                    {t("name")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">
                    {t("email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="votre@email.fr"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 block mb-1.5">
                  {t("subject")} *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Booking, partenariat, presse..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 block mb-1.5">
                  {t("message")} *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="form-input resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {t("error")}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full justify-center"
              >
                {status === "loading" ? (
                  <span className="animate-pulse">Envoi en cours...</span>
                ) : (
                  <>
                    <Mail size={16} />
                    {t("send")}
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
