"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Plus, Edit2, Trash2, X, Check } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  platform: string;
  embedUrl: string;
  featured: boolean;
}

export default function AdminMusicPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", artist: "", platform: "soundcloud", embedUrl: "", coverUrl: "", featured: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [status, session, locale, router]);

  const load = () => {
    fetch("/api/tracks")
      .then((r) => r.json())
      .then((data) => setTracks(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (session) load(); }, [session]);

  const openCreate = () => {
    setEditId(null);
    setForm({ title: "", artist: "", platform: "soundcloud", embedUrl: "", coverUrl: "", featured: false });
    setShowForm(true);
  };

  const openEdit = (t: Track) => {
    setEditId(t.id);
    setForm({ title: t.title, artist: t.artist, platform: t.platform, embedUrl: t.embedUrl, coverUrl: "", featured: t.featured });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editId ? `/api/admin/tracks/${editId}` : "/api/admin/tracks";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce morceau ?")) return;
    await fetch(`/api/admin/tracks/${id}`, { method: "DELETE" });
    load();
  };

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
            <h1 className="text-3xl font-black uppercase">Musique</h1>
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Ajouter</button>
        </div>

        <div className="space-y-3">
          {tracks.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Music size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold flex items-center gap-2">
                  {t.title}
                  {t.featured && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <div className="text-xs text-white/50">{t.artist} · {t.platform}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="btn-secondary p-2"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card p-8 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editId ? "Modifier" : "Nouveau morceau"}</h2>
                  <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  {(["title", "artist", "embedUrl", "coverUrl"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-white/60 block mb-1.5 capitalize">{field}</label>
                      <input type="text" value={form[field] as string} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} className="form-input" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Plateforme</label>
                    <select value={form.platform} onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))} className="form-input">
                      <option value="soundcloud">SoundCloud</option>
                      <option value="spotify">Spotify</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-primary" />
                    <label htmlFor="featured" className="text-sm text-white/70">Featured</label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Annuler</button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                    <Check size={16} /> {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
