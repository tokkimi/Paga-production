"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Plus, Edit2, Trash2, X, Check, User } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  genre: string;
  avatar?: string;
  instagram?: string;
  soundcloud?: string;
  spotify?: string;
}

export default function AdminArtistesPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", bio: "", genre: "", avatar: "", instagram: "", soundcloud: "", spotify: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [status, session, locale, router]);

  const load = () => {
    fetch("/api/artists")
      .then((r) => r.json())
      .then(setArtists)
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (session) load(); }, [session]);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: "", slug: "", bio: "", genre: "", avatar: "", instagram: "", soundcloud: "", spotify: "" });
    setShowForm(true);
  };

  const openEdit = (a: Artist) => {
    setEditId(a.id);
    setForm({ name: a.name, slug: a.slug, bio: a.bio, genre: a.genre, avatar: a.avatar || "", instagram: a.instagram || "", soundcloud: a.soundcloud || "", spotify: a.spotify || "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editId ? `/api/admin/artists/${editId}` : "/api/admin/artists";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet artiste ?")) return;
    await fetch(`/api/admin/artists/${id}`, { method: "DELETE" });
    load();
  };

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
            <h1 className="text-3xl font-black uppercase">Artistes</h1>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {artists.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                {a.avatar ? <img src={a.avatar} alt={a.name} className="w-full h-full rounded-full object-cover" /> : <User size={20} className="text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{a.name}</div>
                <div className="text-xs text-white/50">{a.genre} · /{a.slug}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(a)} className="btn-secondary p-2"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editId ? "Modifier" : "Nouvel artiste"}</h2>
                  <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  {(["name", "slug", "genre", "avatar", "bio", "instagram", "soundcloud", "spotify"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-white/60 block mb-1.5 capitalize">{field}</label>
                      {field === "bio" ? (
                        <textarea value={form[field]} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} rows={3} className="form-input resize-none" />
                      ) : (
                        <input type="text" value={form[field]} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} className="form-input" />
                      )}
                    </div>
                  ))}
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
