"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Plus, Save, Search, Star, Trash2, X } from "lucide-react";

type Application = Record<string, any>;
const statuses = ["PENDING", "REVIEWING", "CONTACTED", "AUDITION", "ACCEPTED", "REJECTED", "ARCHIVED"];
const labels: Record<string, string> = { PENDING: "Nouveau", REVIEWING: "À examiner", CONTACTED: "Contacté", AUDITION: "Audition / échange", ACCEPTED: "Accepté", REJECTED: "Refusé", ARCHIVED: "Archivé" };
const blank = { name: "", stageName: "", realName: "", email: "", phone: "", city: "", country: "", bio: "", genres: "", soundLinks: "{}", socialLinks: "{}", pressKitUrl: "", portfolioUrl: "", experience: "", availability: "", expectations: "", status: "PENDING", priority: "NORMAL", assignedTo: "", nextAction: "", nextActionAt: "", lastContactAt: "", adminNote: "", rating: "" };

function links(value: string) {
  try { return Object.entries(JSON.parse(value || "{}")).filter(([, url]) => url); } catch { return []; }
}

export default function ApplicationsClient() {
  const [items, setItems] = useState<Application[]>([]);
  const [editing, setEditing] = useState<Application | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const load = async () => setItems(await fetch("/api/admin/applications").then((r) => r.json()));
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => items.filter((item) => (status === "ALL" || item.status === status) && JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [items, query, status]);

  const save = async () => {
    if (!editing) return;
    await fetch(editing.id ? "/api/admin/applications/" + editing.id : "/api/admin/applications", { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null); load();
  };
  const remove = async (id: string) => { if (confirm("Supprimer cette candidature ?")) { await fetch("/api/admin/applications/" + id, { method: "DELETE" }); load(); } };

  return (
    <div className="min-h-screen px-4 pb-28 pt-24"><div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Talent scouting</p><h1 className="mt-2 text-3xl font-black uppercase">Candidatures artistes</h1><p className="mt-2 text-sm text-white/45">Écoute, examen, notes, statut et suivi de chaque talent.</p></div><button onClick={() => setEditing({ ...blank })} className="btn-primary justify-center"><Plus size={16} /> Ajouter</button></div>
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="relative"><Search size={16} className="absolute left-3 top-3.5 text-white/30" /><input className="form-input pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, genre, ville, note..." /></label><select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="ALL">Tous les statuts</option>{statuses.map((v) => <option key={v} value={v}>{labels[v]}</option>)}</select></div>
      <div className="grid gap-4 lg:grid-cols-2">{filtered.map((item) => <article key={item.id} className="glass-card p-5">
        <div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{item.stageName || item.name}</h2><span className="rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] font-bold text-cyan-200">{labels[item.status]}</span></div><p className="mt-1 text-sm text-white/45">{item.realName || item.name} · {item.city || "Ville inconnue"} · {item.country || ""}</p></div><div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < (item.rating || 0) ? "fill-yellow-300 text-yellow-300" : "text-white/15"} />)}</div></div>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/65">{item.bio}</p><p className="mt-3 text-xs font-bold uppercase tracking-wider text-white/35">{item.genres || "Genres à compléter"}</p>
        <div className="mt-4 flex flex-wrap gap-2">{[...links(item.soundLinks), ...links(item.socialLinks)].map(([name, url]) => <a key={name} href={String(url)} target="_blank" className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-cyan-200">{name} <ExternalLink className="inline" size={10} /></a>)}</div>
        <div className="mt-5 rounded-xl bg-white/[0.03] p-3"><p className="text-[10px] font-bold uppercase text-white/30">Prochaine action</p><p className="mt-1 text-sm">{item.nextAction || "À définir"} {item.nextActionAt ? "· " + new Date(item.nextActionAt).toLocaleDateString("fr-FR") : ""}</p></div>
        <div className="mt-4 flex gap-2"><button onClick={() => setEditing({ ...item })} className="btn-secondary flex-1 justify-center">Examiner / modifier</button><button onClick={() => remove(item.id)} className="rounded-xl border border-red-400/15 p-3 text-red-300"><Trash2 size={16} /></button></div>
      </article>)}</div>
    </div>
    {editing && <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/80 p-3 backdrop-blur-lg"><div className="mx-auto max-w-4xl rounded-2xl border border-cyan-200/15 bg-[#070b13] p-6"><div className="mb-6 flex justify-between"><div><p className="text-xs font-bold uppercase text-cyan-300">Dossier artiste</p><h2 className="text-2xl font-black">{editing.id ? "Examiner la candidature" : "Ajouter un talent"}</h2></div><button onClick={() => setEditing(null)} className="btn-secondary p-2"><X size={18} /></button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.keys(blank).map((key) => {
          const long = ["bio", "experience", "availability", "expectations", "adminNote", "soundLinks", "socialLinks"].includes(key);
          const type = key.endsWith("At") ? "datetime-local" : key === "rating" ? "number" : key.includes("Url") ? "url" : key === "email" ? "email" : "text";
          if (key === "status") return <label key={key}><span className="mb-1 block text-xs text-white/50">Statut</span><select className="form-input" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>{statuses.map((v) => <option key={v} value={v}>{labels[v]}</option>)}</select></label>;
          if (key === "priority") return <label key={key}><span className="mb-1 block text-xs text-white/50">Priorité</span><select className="form-input" value={editing.priority} onChange={(e) => setEditing({ ...editing, priority: e.target.value })}>{["LOW", "NORMAL", "HIGH", "URGENT"].map((v) => <option key={v}>{v}</option>)}</select></label>;
          return <label key={key} className={long ? "sm:col-span-2" : ""}><span className="mb-1 block text-xs capitalize text-white/50">{key}</span>{long ? <textarea rows={key.includes("Links") ? 3 : 5} className="form-input font-mono text-sm" value={editing[key] || ""} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} /> : <input type={type} min={key === "rating" ? 0 : undefined} max={key === "rating" ? 5 : undefined} className="form-input" value={editing[key] ? String(editing[key]).slice(0, type === "datetime-local" ? 16 : 9999) : ""} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} />}</label>;
        })}
      </div><div className="mt-7 flex justify-end gap-3"><button onClick={() => setEditing(null)} className="btn-secondary">Annuler</button><button onClick={save} className="btn-primary"><Save size={16} /> Enregistrer</button></div>
    </div></div>}</div>
  );
}
