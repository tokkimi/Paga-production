"use client";

import { useEffect, useState } from "react";
import { BarChart3, Eye, Globe2, MousePointerClick, RefreshCw, Smartphone, Users } from "lucide-react";

type Row = { label: string; value: number };
type Stats = Record<string, any>;

function Ranking({ title, rows }: { title: string; rows: Row[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return <section className="glass-card p-5"><h2 className="mb-4 font-bold">{title}</h2><div className="space-y-3">{rows.map((row) => <div key={row.label}><div className="mb-1 flex justify-between gap-4 text-xs"><span className="truncate text-white/65">{row.label}</span><strong>{row.value}</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-cyan-300" style={{ width: (row.value / max) * 100 + "%" }} /></div></div>)}</div></section>;
}

export default function StatsClient() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Stats | null>(null);
  const load = () => fetch("/api/admin/stats?days=" + days).then((r) => r.json()).then(setData);
  useEffect(() => { load(); }, [days]);
  if (!data) return <div className="min-h-screen pt-32 text-center text-white/40">Chargement des statistiques...</div>;
  const cards = [
    ["Vues période", data.summary.views, Eye], ["Visiteurs uniques", data.summary.uniqueVisitors, Users],
    ["Vues aujourd'hui", data.summary.todayViews, BarChart3], ["Vues 7 jours", data.summary.weekViews, Globe2],
    ["Clics", data.summary.clicks, MousePointerClick], ["Campagnes", data.summary.campaigns, Smartphone],
  ] as const;
  return <div className="min-h-screen px-4 pb-28 pt-24"><div className="mx-auto max-w-7xl">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Analytics</p><h1 className="mt-2 text-3xl font-black uppercase">Statistiques détaillées</h1><p className="mt-2 text-sm text-white/45">Qui visite, depuis où, sur quoi les visiteurs cliquent et quelles pages convertissent.</p></div><div className="flex gap-2"><select className="form-input" value={days} onChange={(e) => setDays(Number(e.target.value))}>{[7, 30, 90, 365].map((v) => <option key={v} value={v}>{v} jours</option>)}</select><button onClick={load} className="btn-secondary p-3"><RefreshCw size={16} /></button></div></div>
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{cards.map(([label, value, Icon]) => <div key={label} className="glass-card p-4"><Icon size={18} className="mb-3 text-cyan-300" /><div className="text-3xl font-black">{value}</div><div className="mt-1 text-[10px] font-bold uppercase text-white/35">{label}</div></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-2"><Ranking title="Pages les plus vues" rows={data.pages} /><Ranking title="Clics les plus fréquents" rows={data.clickTargets} /><Ranking title="Pays" rows={data.countries} /><Ranking title="Villes" rows={data.cities} /><Ranking title="Sources de trafic" rows={data.referrers} /><Ranking title="Appareils" rows={data.devices} /></div>
    <section className="glass-card mt-4 p-5"><h2 className="mb-4 font-bold">Activité récente</h2><div className="max-h-[520px] divide-y divide-white/5 overflow-y-auto">{data.recent.map((row: any, i: number) => <div key={i} className="grid gap-1 py-3 sm:grid-cols-[80px_1fr_auto] sm:items-center"><span className={"w-fit rounded-full px-2 py-1 text-[9px] font-black uppercase " + (row.type === "click" ? "bg-violet-400/10 text-violet-300" : "bg-cyan-300/10 text-cyan-200")}>{row.type}</span><div><p className="text-sm font-medium">{row.label}</p><p className="text-xs text-white/35">{row.detail}</p></div><time className="text-xs text-white/30">{new Date(row.date).toLocaleString("fr-FR")}</time></div>)}</div></section>
  </div></div>;
}
