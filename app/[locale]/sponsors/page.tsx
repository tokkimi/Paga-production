"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Send, Building2, Sparkles, Target, Handshake, LineChart } from "lucide-react";

const stats = [
  { value: "50K+", key: "followers" },
  { value: "15+", key: "events" },
  { value: "8", key: "cities" },
  { value: "3", key: "countries" },
];

const benefits = [
  { icon: Target, title: "activation_title", desc: "activation_desc" },
  { icon: Sparkles, title: "premium_title", desc: "premium_desc" },
  { icon: LineChart, title: "tracking_title", desc: "tracking_desc" },
];

export default function SponsorsPage() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations("sponsors");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    contactEmail: "",
    phone: "",
    budget: "",
    campaignType: "",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          contactEmail: form.contactEmail || session?.user?.email,
        }),
      });
      if (res.ok || res.status === 201) {
        setStatus("success");
        setShowForm(false);
        setForm({ brandName: "", contactEmail: "", phone: "", budget: "", campaignType: "", description: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen px-4 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">{t("eyebrow")}</p>
          <h1 className="section-title mb-4">{t("title")}</h1>
          <p className="mx-auto max-w-2xl text-white/62">{t("subtitle")}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {session ? (
              <button onClick={() => setShowForm(true)} className="btn-primary px-8 py-4">
                <Send size={16} /> {t("cta")}
              </button>
            ) : (
              <>
                <Link href={"/" + locale + "/inscription"} className="btn-primary px-8 py-4">
                  <Building2 size={16} /> {t("create_pro")}
                </Link>
                <Link href={"/" + locale + "/connexion"} className="btn-secondary px-8 py-4">
                  {t("login")}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
              <div className="mb-1 text-3xl font-black text-primary">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-white/60">{t("stats." + stat.key)}</div>
            </motion.div>
          ))}
        </div>

        <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t("benefits." + item.title)}</h3>
                <p className="text-sm leading-relaxed text-white/60">{t("benefits." + item.desc)}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="glass-card mx-auto max-w-3xl p-7 text-center sm:p-9">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-200">
            <Handshake size={25} />
          </div>
          <h2 className="mb-3 text-2xl font-black uppercase">{t("custom_title")}</h2>
          <p className="mx-auto mb-7 max-w-xl text-sm leading-relaxed text-white/60">{t("custom_desc")}</p>
          <ul className="mx-auto mb-8 grid max-w-xl gap-3 text-left text-sm text-white/70 sm:grid-cols-2">
            {["budget", "goals", "roster", "validation"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check size={15} className="text-primary" />
                {t("bullets." + item)}
              </li>
            ))}
          </ul>
          {session ? (
            <button onClick={() => setShowForm(true)} className="btn-primary justify-center">
              <Send size={16} /> {t("cta")}
            </button>
          ) : (
            <Link href={"/" + locale + "/inscription"} className="btn-primary justify-center">
              {t("create_pro_account")}
            </Link>
          )}
        </div>

        {showForm && session && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card mx-auto mt-10 max-w-2xl p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <Building2 size={20} className="text-primary" />
              {t("proposal_title")}
            </h2>

            {status === "success" ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <Check size={28} className="text-green-400" />
                </div>
                <p className="font-medium text-green-400">{t("success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">{t("brand_name")} *</label>
                    <input type="text" required value={form.brandName} onChange={(e) => setForm((p) => ({ ...p, brandName: e.target.value }))} className="form-input" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">{t("contact_email")} *</label>
                    <input type="email" required value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} className="form-input" placeholder={session.user.email || ""} />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">{t("phone")}</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="+33 6 12 34 56 78" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">{t("budget")}</label>
                    <input type="text" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} className="form-input" placeholder={t("budget_placeholder")} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">{t("campaign_type")}</label>
                  <input type="text" value={form.campaignType} onChange={(e) => setForm((p) => ({ ...p, campaignType: e.target.value }))} className="form-input" placeholder={t("campaign_placeholder")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">{t("description")} *</label>
                  <textarea required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={5} className="form-input resize-none" placeholder={t("description_placeholder")} />
                </div>
                {status === "error" && <p className="text-sm text-red-400">{t("error")}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">{t("cancel")}</button>
                  <button type="submit" disabled={status === "loading"} className="btn-primary flex-1 justify-center">
                    <Send size={16} />
                    {status === "loading" ? t("sending") : t("submit")}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {!session && <p className="mt-7 text-center text-sm text-white/42">{t("login_required")}</p>}
      </div>
    </div>
  );
}
