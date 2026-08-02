"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Send, Building2, Handshake } from "lucide-react";

const stats = [
  { value: "2M+", key: "followers" },
  { value: "15+", key: "events" },
  { value: "8", key: "cities" },
  { value: "3", key: "countries" },
];

const benefits = [
  { title: "activation_title", desc: "activation_desc" },
  { title: "premium_title", desc: "premium_desc" },
  { title: "tracking_title", desc: "tracking_desc" },
];

export default function SponsorsPage() {
  const t = useTranslations("sponsors");
  const [form, setForm] = useState({
    brandName: "",
    contactName: "",
    contactEmail: "",
    phone: "",
    website: "",
    budget: "",
    campaignType: "",
    goals: "",
    deliverables: "",
    description: "",
  });
  const [pdf, setPdf] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (pdf) payload.append("pdf", pdf);

      const res = await fetch("/api/sponsors", {
        method: "POST",
        body: payload,
      });
      if (res.ok || res.status === 201) {
        setStatus("success");
        setPdf(null);
        setForm({ brandName: "", contactName: "", contactEmail: "", phone: "", website: "", budget: "", campaignType: "", goals: "", deliverables: "", description: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="sherrie-page min-h-screen px-4 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">{t("eyebrow")}</p>
          <h1 className="section-title mb-4">{t("title")}</h1>
          <p className="mx-auto max-w-2xl text-white/62">{t("subtitle")}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#sponsor-form" className="btn-primary px-8 py-4">
              <Send size={16} /> {t("cta")}
            </a>
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
          {benefits.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-7">
              <h3 className="mb-2 text-lg font-bold">{t("benefits." + item.title)}</h3>
              <p className="text-sm leading-relaxed text-white/60">{t("benefits." + item.desc)}</p>
            </motion.div>
          ))}
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
          <a href="#sponsor-form" className="btn-primary justify-center">
            <Send size={16} /> {t("cta")}
          </a>
        </div>

        <motion.div id="sponsor-form" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card mx-auto mt-10 max-w-3xl scroll-mt-28 p-8">
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
                  <label className="mb-1.5 block text-xs font-medium text-white/60">Nom du contact *</label>
                  <input type="text" required value={form.contactName} onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">{t("contact_email")} *</label>
                  <input type="email" required value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} className="form-input" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">{t("phone")}</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="+33 6 12 34 56 78" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">Site / réseau social</label>
                  <input type="text" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} className="form-input" placeholder="https://..." />
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
                <label className="mb-1.5 block text-xs font-medium text-white/60">Objectifs de la campagne</label>
                <textarea value={form.goals} onChange={(e) => setForm((p) => ({ ...p, goals: e.target.value }))} rows={3} className="form-input resize-none" placeholder="Notoriété, lancement produit, contenu social, présence événementielle..." />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">Éléments attendus</label>
                <textarea value={form.deliverables} onChange={(e) => setForm((p) => ({ ...p, deliverables: e.target.value }))} rows={3} className="form-input resize-none" placeholder="Posts, stories, vidéo, présence, code promo, usage image..." />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">PDF / brief de campagne</label>
                <input type="file" accept="application/pdf,.pdf" onChange={(e) => setPdf(e.target.files?.[0] || null)} className="form-input file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
                <p className="mt-1 text-xs text-white/40">PDF accepté, maximum 5 Mo.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">{t("description")} *</label>
                <textarea required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={5} className="form-input resize-none" placeholder={t("description_placeholder")} />
              </div>
              {status === "error" && <p className="text-sm text-red-400">{t("error")}</p>}
              <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center">
                <Send size={16} />
                {status === "loading" ? t("sending") : t("submit")}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
