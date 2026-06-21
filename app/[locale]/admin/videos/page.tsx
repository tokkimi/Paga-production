"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Plus, Edit2, Trash2, X, Check } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  youtubeEmbedUrl: string;
  thumbnail?: string;
  isActive: boolean;
  order: number;
}

export default function AdminVideosPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", youtubeEmbedUrl: "", thumbnail: "", order: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [status, session, locale, router]);

  const load = () => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (session) load(); }, [session]);

  const openCreate = () => {
    setEditId(null);
    setForm({ title: "", youtubeEmbedUrl: "", thumbnail: "", order: 0, isActive: true });
    setShowForm(true);
  };

  const openEdit = (v: VideoItem) => {
    setEditId(v.id);
    setForm({ title: v.title, youtubeEmbedUrl: v.youtubeEmbedUrl, thumbnail: v.thumbnail || "", order: v.order, isActive: v.isActive });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editId ? `/api/admin/videos/${editId}` : "/api/admin/videos";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette vidéo ?")) return;
    await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    load();
  };

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
            <h1 className="text-3xl font-black uppercase">Vidéos</h1>
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Ajouter</button>
        </div>

        <div className="space-y-3">
          {videos.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Video size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{v.title}</div>
                <div className="text-xs text-white/50 truncate">{v.youtubeEmbedUrl}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(v)} className="btn-secondary p-2"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(v.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card p-8 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editId ? "Modifier" : "Nouvelle vidéo"}</h2>
                  <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Titre *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="form-input" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">YouTube Embed URL *</label>
                    <input type="text" value={form.youtubeEmbedUrl} onChange={(e) => setForm((p) => ({ ...p, youtubeEmbedUrl: e.target.value }))} className="form-input" placeholder="https://www.youtube.com/embed/VIDEO_ID" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Thumbnail URL</label>
                    <input type="text" value={form.thumbnail} onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))} className="form-input" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Ordre</label>
                    <input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="form-input" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
                    <label htmlFor="isActive" className="text-sm text-white/70">Actif</label>
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
