"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, ChevronLeft, Music, User, Link as LinkIcon, Mic } from "lucide-react";

const genreOptions = [
  "House", "Tech House", "Techno", "Deep House", "Afro House",
  "Melodic Techno", "Progressive House", "Trance", "Drum & Bass",
  "Electro", "Minimal", "Organic House", "Hip-Hop", "Disco",
];

export default function RejoindrePage() {
  const t = useTranslations("join");
  const steps = [
    { title: t("step1"), icon: User },
    { title: t("step2"), icon: Music },
    { title: t("step3"), icon: LinkIcon },
    { title: t("step4"), icon: Mic },
  ];
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", email: "", bio: "",
    soundcloud: "", spotify: "", youtube: "",
    instagram: "", tiktok: "",
  });

  const updateForm = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const toggleGenre = (genre: string) => setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/apply-artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          bio: form.bio,
          genres: selectedGenres.join(", "),
          soundLinks: { soundcloud: form.soundcloud, spotify: form.spotify, youtube: form.youtube },
          socialLinks: { instagram: form.instagram, tiktok: form.tiktok },
        }),
      });
      if (res.ok || res.status === 201) setSubmitted(true);
    } catch {
      console.error("Submit error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-md p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="mb-3 text-2xl font-black uppercase">{t("success")}</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-20 pt-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">Artists</p>
          <h1 className="section-title mb-4">{t("title")}</h1>
          <p className="text-white/60">{t("subtitle")}</p>
        </div>

        <div className="mb-10 flex items-center justify-center gap-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="flex items-center gap-2">
                <div className={"flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all " + (i < step ? "bg-primary/30 text-primary" : i === step ? "bg-primary text-white" : "bg-white/10 text-white/40")}>
                  {i < step ? <CheckCircle size={16} /> : <Icon size={16} />}
                </div>
                {i < steps.length - 1 && <div className={"h-0.5 w-10 transition-all " + (i < step ? "bg-primary" : "bg-white/10")} />}
              </div>
            );
          })}
        </div>

        <div className="glass-card p-8">
          <h2 className="mb-6 text-lg font-bold">{steps[step].title}</h2>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <label className="block"><span className="mb-1.5 block text-xs font-medium text-white/60">{t("name")} *</span><input value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="form-input" required /></label>
                <label className="block"><span className="mb-1.5 block text-xs font-medium text-white/60">{t("email")} *</span><input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className="form-input" required /></label>
                <label className="block"><span className="mb-1.5 block text-xs font-medium text-white/60">{t("bio")} *</span><textarea value={form.bio} onChange={(e) => updateForm("bio", e.target.value)} rows={5} className="form-input resize-none" required /></label>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {["soundcloud", "spotify", "youtube"].map((field) => (
                  <label key={field} className="block"><span className="mb-1.5 block text-xs font-medium text-white/60">{t(field)}</span><input type="url" value={form[field as keyof typeof form]} onChange={(e) => updateForm(field, e.target.value)} className="form-input" /></label>
                ))}
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {["instagram", "tiktok"].map((field) => (
                  <label key={field} className="block"><span className="mb-1.5 block text-xs font-medium text-white/60">{t(field)}</span><input type="url" value={form[field as keyof typeof form]} onChange={(e) => updateForm(field, e.target.value)} className="form-input" /></label>
                ))}
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="mb-4 text-sm text-white/60">{t("genres")}</p>
                <div className="flex flex-wrap gap-2">
                  {genreOptions.map((genre) => (
                    <button key={genre} type="button" onClick={() => toggleGenre(genre)} className={"rounded-full px-3 py-1.5 text-sm font-medium transition-all " + (selectedGenres.includes(genre) ? "bg-primary text-white" : "glass-card text-white/70 hover:border-primary/30 hover:text-white")}>{genre}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="btn-secondary flex-1 justify-center"><ChevronLeft size={16} /> {t("prev")}</button>}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && (!form.name || !form.email || !form.bio)} className="btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50">{t("next")} <ChevronRight size={16} /></button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || selectedGenres.length === 0} className="btn-primary flex-1 justify-center disabled:opacity-50">{loading ? t("sending") : t("submit")}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
