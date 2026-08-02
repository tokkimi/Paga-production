"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle, ChevronLeft, ChevronRight, Send } from "lucide-react";

const genres = ["House", "Tech House", "Techno", "Deep House", "Afro House", "Melodic Techno", "Progressive House", "Trance", "Drum & Bass", "Electro", "Minimal", "Organic House", "Hip-Hop", "Disco"];

const labels = {
  fr: { details: "Profil", music: "Musique & réseaux", project: "Projet", stage: "Nom d'artiste", real: "Nom réel", phone: "Téléphone", city: "Ville", country: "Pays", experience: "Expérience / parcours", availability: "Disponibilités", expectations: "Ce que vous recherchez chez Sherrie Sherrie", press: "Lien press kit", portfolio: "Portfolio / dossier", next: "Suivant", back: "Retour", send: "Envoyer la candidature" },
  en: { details: "Profile", music: "Music & social", project: "Project", stage: "Artist name", real: "Real name", phone: "Phone", city: "City", country: "Country", experience: "Experience / background", availability: "Availability", expectations: "What you expect from Sherrie Sherrie", press: "Press kit link", portfolio: "Portfolio / deck", next: "Next", back: "Back", send: "Submit application" },
  ko: { details: "프로필", music: "음악 & 소셜", project: "프로젝트", stage: "아티스트명", real: "실명", phone: "전화번호", city: "도시", country: "국가", experience: "경력 / 활동", availability: "활동 가능 일정", expectations: "Sherrie Sherrie에 기대하는 점", press: "프레스 킷 링크", portfolio: "포트폴리오 / 소개서", next: "다음", back: "이전", send: "지원서 보내기" },
};

export default function JoinPage() {
  const t = useTranslations("join");
  const locale = useLocale() as "fr" | "en" | "ko";
  const l = labels[locale] || labels.en;
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", realName: "", email: "", phone: "", city: "", country: "", bio: "", soundcloud: "", spotify: "", youtube: "", instagram: "", tiktok: "", pressKitUrl: "", portfolioUrl: "", experience: "", availability: "", expectations: "" });

  const update = (key: string, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const submit = async () => {
    setLoading(true);
    const response = await fetch("/api/apply-artist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, genres: selected.join(", "), soundLinks: { soundcloud: form.soundcloud, spotify: form.spotify, youtube: form.youtube }, socialLinks: { instagram: form.instagram, tiktok: form.tiktok } }),
    });
    setLoading(false);
    if (response.ok) setSent(true);
  };

  if (sent) {
    return (
      <div className="sherrie-page flex min-h-screen items-center justify-center px-4">
        <div className="glass-card max-w-md p-10 text-center">
          <CheckCircle size={42} className="mx-auto mb-5 text-green-500" />
          <h1 className="text-2xl font-black">{t("success")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="sherrie-page min-h-screen px-4 pb-28 pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#aa5d74]">Talent application</p>
          <h1 className="section-title mt-3">{t("title")}</h1>
          <p className="mt-3 text-[#111118]/58">{t("subtitle")}</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {[l.details, l.music, l.project].map((name, index) => (
            <div key={name} className={"rounded-xl p-3 text-center text-xs font-bold " + (step === index ? "bg-[#8fdff0] text-[#111118]" : index < step ? "bg-[#aa5d74]/12 text-[#aa5d74]" : "bg-black/5 text-[#111118]/48")}>
              {index + 1}. {name}
            </div>
          ))}
        </div>

        <div className="glass-card p-5 sm:p-8">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={l.stage + " *"} value={form.name} onChange={(value) => update("name", value)} />
              <Field label={l.real} value={form.realName} onChange={(value) => update("realName", value)} />
              <Field label={t("email") + " *"} type="email" value={form.email} onChange={(value) => update("email", value)} />
              <Field label={l.phone} value={form.phone} onChange={(value) => update("phone", value)} />
              <Field label={l.city} value={form.city} onChange={(value) => update("city", value)} />
              <Field label={l.country} value={form.country} onChange={(value) => update("country", value)} />
              <Area label={t("bio") + " *"} value={form.bio} onChange={(value) => update("bio", value)} />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {["soundcloud", "spotify", "youtube", "instagram", "tiktok"].map((key) => (
                <Field key={key} label={key[0].toUpperCase() + key.slice(1)} type="url" value={form[key as keyof typeof form]} onChange={(value) => update(key, value)} />
              ))}
              <Field label={l.press} type="url" value={form.pressKitUrl} onChange={(value) => update("pressKitUrl", value)} />
              <Field label={l.portfolio} type="url" value={form.portfolioUrl} onChange={(value) => update("portfolioUrl", value)} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm text-[#111118]/58">{t("genres")}</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button type="button" key={genre} onClick={() => setSelected((previous) => previous.includes(genre) ? previous.filter((item) => item !== genre) : [...previous, genre])} className={"rounded-full px-3 py-2 text-xs font-bold " + (selected.includes(genre) ? "bg-[#8fdff0] text-[#111118]" : "bg-black/5 text-[#111118]/58")}>
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <Area label={l.experience} value={form.experience} onChange={(value) => update("experience", value)} />
              <Area label={l.availability} value={form.availability} onChange={(value) => update("availability", value)} />
              <Area label={l.expectations} value={form.expectations} onChange={(value) => update("expectations", value)} />
            </div>
          )}

          <div className="mt-7 flex gap-3">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1 justify-center"><ChevronLeft size={16} /> {l.back}</button>}
            {step < 2 ? (
              <button disabled={step === 0 && (!form.name || !form.email || !form.bio)} onClick={() => setStep(step + 1)} className="btn-primary flex-1 justify-center disabled:opacity-40">{l.next} <ChevronRight size={16} /></button>
            ) : (
              <button disabled={loading || !selected.length} onClick={submit} className="btn-primary flex-1 justify-center disabled:opacity-40"><Send size={16} /> {loading ? t("sending") : l.send}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label>
      <span className="mb-1.5 block text-xs text-[#111118]/58">{label}</span>
      <input type={type} className="form-input border-[#111118]/10 bg-white/80 text-[#111118]" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block sm:col-span-2">
      <span className="mb-1.5 block text-xs text-[#111118]/58">{label}</span>
      <textarea rows={4} className="form-input resize-y border-[#111118]/10 bg-white/80 text-[#111118]" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
