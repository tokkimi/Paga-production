"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus, Edit2, Trash2, X, Check } from "lucide-react";

interface EventItem {
  id: string;
  title_fr: string;
  title_en: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  slug: string;
  isFeatured: boolean;
  isB2B: boolean;
  ticketUrl?: string;
}

export default function AdminDatesPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title_fr: "", title_en: "", date: "", venue: "", city: "",
    country: "France", slug: "", isFeatured: false, isB2B: false,
    ticketUrl: "", description_fr: "", description_en: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [status, session, locale, router]);

  const load = () => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (session) load(); }, [session]);

  const openCreate = () => {
    setEditId(null);
    setForm({ title_fr: "", title_en: "", date: "", venue: "", city: "", country: "France", slug: "", isFeatured: false, isB2B: false, ticketUrl: "", description_fr: "", description_en: "" });
    setShowForm(true);
  };

  const openEdit = (e: EventItem) => {
    setEditId(e.id);
    setForm({ title_fr: e.title_fr, title_en: e.title_en, date: e.date.slice(0, 16), venue: e.venue, city: e.city, country: e.country, slug: e.slug, isFeatured: e.isFeatured, isB2B: e.isB2B, ticketUrl: e.ticketUrl || "", description_fr: "", description_en: "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editId ? `/api/admin/events/${editId}` : "/api/admin/events";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, date: new Date(form.date).toISOString() }) });
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet événement ?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    load();
  };

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
            <h1 className="text-3xl font-black uppercase">Événements</h1>
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Ajouter</button>
        </div>

        <div className="space-y-3">
          {events.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CalendarDays size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold flex items-center gap-2">
                  {e.title_fr}
                  {e.isFeatured && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                  {e.isB2B && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">B2B</span>}
                </div>
                <div className="text-xs text-white/50">{new Date(e.date).toLocaleDateString("fr-FR")} · {e.venue}, {e.city}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(e)} className="btn-secondary p-2"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editId ? "Modifier" : "Nouvel événement"}</h2>
                  <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  {([
                    ["title_fr", "Titre FR *"], ["title_en", "Titre EN"],
                    ["slug", "Slug (URL) *"], ["venue", "Salle *"],
                    ["city", "Ville *"], ["country", "Pays"],
                    ["ticketUrl", "Lien billetterie"],
                    ["description_fr", "Description FR"], ["description_en", "Description EN"]
                  ] as [keyof typeof form, string][]).map(([field, label]) => (
                    <div key={field}>
                      <label className="text-xs font-medium text-white/60 block mb-1.5">{label}</label>
                      {field.startsWith("description") ? (
                        <textarea value={form[field] as string} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} rows={3} className="form-input resize-none" />
                      ) : (
                        <input type="text" value={form[field] as string} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} className="form-input" />
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Date et heure *</label>
                    <input type="datetime-local" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="form-input" />
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <label htmlFor="isFeatured" className="text-sm text-white/70">Featured</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="isB2B" checked={form.isB2B} onChange={(e) => setForm((p) => ({ ...p, isB2B: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <label htmlFor="isB2B" className="text-sm text-white/70">B2B</label>
                    </div>
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
