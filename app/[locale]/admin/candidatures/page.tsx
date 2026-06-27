"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, ChevronRight, Loader2, Save, Search, X } from "lucide-react";

type AppStatus = "PENDING" | "REVIEWING" | "CONTACTED" | "AUDITION" | "ACCEPTED" | "REJECTED" | "ARCHIVED";
type Priority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

interface Application {
  id: string;
  name: string;
  realName?: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  bio: string;
  genres: string;
  soundLinks: string;
  socialLinks: string;
  pressKitUrl?: string;
  portfolioUrl?: string;
  stageName?: string;
  experience?: string;
  availability?: string;
  expectations?: string;
  status: AppStatus;
  priority: Priority;
  assignedTo?: string;
  nextAction?: string;
  nextActionAt?: string;
  lastContactAt?: string;
  adminNote?: string;
  rating?: number;
  createdAt: string;
}

const statusLabels: Record<AppStatus, string> = {
  PENDING: "En attente", REVIEWING: "En cours d'examen", CONTACTED: "Contacté",
  AUDITION: "Audition", ACCEPTED: "Accepté", REJECTED: "Refusé", ARCHIVED: "Archivé",
};

const statuses: AppStatus[] = ["PENDING", "REVIEWING", "CONTACTED", "AUDITION", "ACCEPTED", "REJECTED", "ARCHIVED"];

export default function CandidaturesPage() {
  const { data: session, status: authStatus } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Application | null>(null);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (authStatus === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [authStatus, session, locale, router]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/candidatures");
      if (!res.ok) throw new Error("Impossible de charger les candidatures.");
      setApps(await res.json());
    } catch (e) {
      setFeedback({ type: "error", message: e instanceof Error ? e.message : "Erreur de chargement." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session) load(); }, [session]);

  const filtered = useMemo(() => apps.filter((a) => {
    const text = JSON.stringify(a).toLowerCase();
    return (filterStatus === "ALL" || a.status === filterStatus) && text.includes(query.toLowerCase());
  }), [apps, query, filterStatus]);

  const save = async () => {
    if (!editing || saving) return;
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/candidatures/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("La modification n'a pas pu être enregistrée.");
      setEditing(null);
      setFeedback({ type: "success", message: "Candidature mise à jour." });
      await load();
    } catch (e) {
      setFeedback({ type: "error", message: e instanceof Error ? e.message : "Erreur." });
    } finally {
      setSaving(false);
    }
  };

  if (authStatus === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;
  }

  return (
    <div className="min-h-screen px-4 pb-28 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-primary">Admin</p>
            <h1 className="text-3xl font-black uppercase sm:text-4xl">Candidatures artistes</h1>
            <p className="mt-2 text-sm text-white/45">Gestion des candidatures reçues via le formulaire.</p>
          </div>
          <a href="../admin/partenariats" className="btn-secondary text-sm">← Business Board</a>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-3.5 text-white/30" size={16} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="form-input pl-10" placeholder="Rechercher nom, genre, ville..." />
          </label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-input min-w-48">
            <option value="ALL">Tous les statuts</option>
            {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
        </div>

        {feedback && (
          <div className={"mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm " + (feedback.type === "success" ? "border-green-400/20 bg-green-400/10 text-green-200" : "border-red-400/20 bg-red-400/10 text-red-200")}>
            {feedback.type === "success" ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="ml-auto"><X size={15} /></button>
          </div>
        )}

        <div className="grid gap-3">
          {filtered.length === 0 && !loading && <p className="py-12 text-center text-white/35">Aucune candidature trouvée.</p>}
          {filtered.map((app) => (
            <article key={app.id} className="glass-card grid gap-4 p-5 lg:grid-cols-[1.4fr_.8fr_auto] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold">{app.name}{app.stageName ? ` (${app.stageName})` : ""}</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase text-primary">{statusLabels[app.status]}</span>
                  {app.priority !== "NORMAL" && <span className="rounded-full bg-orange-400/10 px-2 py-1 text-[10px] font-bold text-orange-300">{app.priority}</span>}
                </div>
                <p className="mt-1 text-sm text-white/50">{app.email} {app.city ? `· ${app.city}` : ""}</p>
                <p className="mt-1.5 text-xs text-white/40 line-clamp-2">{app.genres}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Prochaine action</p>
                <p className="mt-1 text-sm">{app.nextAction || "À planifier"}</p>
                {app.adminNote && <p className="mt-1 text-xs text-yellow-300/70 line-clamp-1">Note : {app.adminNote}</p>}
              </div>
              <button onClick={() => setEditing({ ...app })} className="btn-secondary p-3" title="Gérer"><ChevronRight size={16} /></button>
            </article>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/75 p-3 backdrop-blur-lg sm:p-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/15 bg-[#070b13] p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black">Gérer la candidature</h2>
              <button onClick={() => setEditing(null)} className="btn-secondary p-2"><X size={18} /></button>
            </div>

            <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm">
              <p className="font-bold">{editing.name} {editing.stageName ? `(${editing.stageName})` : ""}</p>
              <p className="text-white/50 mt-0.5">{editing.email} · {editing.phone || "Pas de téléphone"}</p>
              <p className="text-white/40 mt-1">{editing.genres}</p>
              {editing.soundLinks && <a href={editing.soundLinks} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs text-primary hover:underline">{editing.soundLinks}</a>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-1 block text-xs text-white/50">Statut</span>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AppStatus })} className="form-input">
                  {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs text-white/50">Priorité</span>
                <select value={editing.priority} onChange={(e) => setEditing({ ...editing, priority: e.target.value as Priority })} className="form-input">
                  {["LOW", "NORMAL", "HIGH", "URGENT"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs text-white/50">Prochaine action</span>
                <input type="text" value={editing.nextAction || ""} onChange={(e) => setEditing({ ...editing, nextAction: e.target.value })} className="form-input" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-white/50">Échéance</span>
                <input type="datetime-local" value={editing.nextActionAt ? editing.nextActionAt.slice(0, 16) : ""} onChange={(e) => setEditing({ ...editing, nextActionAt: e.target.value })} className="form-input" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1 block text-xs text-white/50">Notes internes</span>
                <textarea rows={3} value={editing.adminNote || ""} onChange={(e) => setEditing({ ...editing, adminNote: e.target.value })} className="form-input resize-y" />
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} disabled={saving} className="btn-secondary disabled:opacity-40">Annuler</button>
              <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
