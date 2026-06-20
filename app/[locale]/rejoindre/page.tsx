"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, ChevronLeft, Music, User, Link as LinkIcon, Mic } from "lucide-react";

const steps = [
  { title: "Infos personnelles", icon: User },
  { title: "Liens musicaux", icon: Music },
  { title: "Réseaux sociaux", icon: LinkIcon },
  { title: "Genres musicaux", icon: Mic },
];

const genreOptions = [
  "House", "Tech House", "Techno", "Deep House", "Afro House",
  "Melodic Techno", "Progressive House", "Trance", "Drum & Bass",
  "Electro", "Minimal", "Organic House", "Hip-Hop", "Disco",
];

export default function RejoindreePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", email: "", bio: "",
    soundcloud: "", spotify: "", youtube: "",
    instagram: "", tiktok: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

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
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-black uppercase mb-3">Candidature envoyée !</h2>
          <p className="text-white/60">Merci pour votre candidature. Nous l&apos;étudierons avec attention et vous répondrons sous 7 jours.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">Artists</p>
          <h1 className="section-title mb-4">Rejoindre la Famille</h1>
          <p className="text-white/60">Tu es artiste et tu veux intégrer l&apos;univers Paga Production ?</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? "bg-primary/30 text-primary" : i === step ? "bg-primary text-white" : "bg-white/10 text-white/40"
                }`}>
                  {i < step ? "✓" : <Icon size={16} />}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-10 h-0.5 transition-all ${i < step ? "bg-primary" : "bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="glass-card p-8">
          <h2 className="text-lg font-bold mb-6">{steps[step].title}</h2>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">Nom d&apos;artiste *</label>
                  <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="form-input" placeholder="DJ Example" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className="form-input" placeholder="dj@example.com" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">Bio *</label>
                  <textarea value={form.bio} onChange={(e) => updateForm("bio", e.target.value)} rows={5} className="form-input resize-none" placeholder="Parlez-nous de vous, votre univers musical, votre parcours..." required />
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">SoundCloud</label>
                  <input type="url" value={form.soundcloud} onChange={(e) => updateForm("soundcloud", e.target.value)} className="form-input" placeholder="https://soundcloud.com/votre-profil" />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">Spotify</label>
                  <input type="url" value={form.spotify} onChange={(e) => updateForm("spotify", e.target.value)} className="form-input" placeholder="https://open.spotify.com/artist/..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">YouTube</label>
                  <input type="url" value={form.youtube} onChange={(e) => updateForm("youtube", e.target.value)} className="form-input" placeholder="https://youtube.com/@votre-chaine" />
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">Instagram</label>
                  <input type="url" value={form.instagram} onChange={(e) => updateForm("instagram", e.target.value)} className="form-input" placeholder="https://www.instagram.com/votre-profil" />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">TikTok</label>
                  <input type="url" value={form.tiktok} onChange={(e) => updateForm("tiktok", e.target.value)} className="form-input" placeholder="https://tiktok.com/@votre-profil" />
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-sm text-white/60 mb-4">Sélectionnez vos genres musicaux principaux :</p>
                <div className="flex flex-wrap gap-2">
                  {genreOptions.map((genre) => (
                    <button key={genre} type="button" onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedGenres.includes(genre) ? "bg-primary text-white" : "glass-card text-white/70 hover:text-white hover:border-primary/30"
                      }`}>{genre}</button>
                  ))}
                </div>
                {selectedGenres.length > 0 && (
                  <p className="text-xs text-white/50 mt-4">Sélectionnés : {selectedGenres.join(", ")}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn-secondary flex-1 justify-center">
                <ChevronLeft size={16} /> Précédent
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && (!form.name || !form.email || !form.bio)}
                className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || selectedGenres.length === 0}
                className="btn-primary flex-1 justify-center disabled:opacity-50">
                {loading ? "Envoi..." : "Envoyer ma candidature"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
