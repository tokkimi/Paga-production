"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  CheckCircle, Clock, XCircle, Download, RotateCcw, Trash2, Receipt,
  Search, Filter, TrendingUp, Euro,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  prestation: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELLED";
  type: "ARTIST" | "SPONSOR";
  clientName: string;
  clientEmail: string;
  sentAt: string | null;
  paidAt: string | null;
}

const statusConfig = {
  PENDING_PAYMENT: { label: "En attente", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", Icon: Clock },
  PAID: { label: "Payé", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30", Icon: CheckCircle },
  CANCELLED: { label: "Annulé", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", Icon: XCircle },
};

export default function FacturationPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [status, session, locale, router]);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/invoices/all")
      .then((r) => r.json())
      .then((data) => setInvoices(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: updated.status, paidAt: updated.paidAt } : inv));
      }
    } finally {
      setUpdating(null);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Supprimer définitivement cette facture ?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      if (res.ok) setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = invoices.filter((inv) => {
    const text = `${inv.invoiceNumber} ${inv.clientName} ${inv.clientEmail} ${inv.prestation}`.toLowerCase();
    return (
      (filterStatus === "ALL" || inv.status === filterStatus) &&
      (filterType === "ALL" || inv.type === filterType) &&
      text.includes(query.toLowerCase())
    );
  });

  const totalPaid = filtered.filter((i) => i.status === "PAID").reduce((s, i) => s + i.priceTTC, 0);
  const totalPending = filtered.filter((i) => i.status === "PENDING_PAYMENT").reduce((s, i) => s + i.priceTTC, 0);
  const totalAll = filtered.reduce((s, i) => s + i.priceTTC, 0);

  return (
    <div className="min-h-screen px-4 pb-28 pt-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Administration</p>
          <h1 className="text-3xl font-black uppercase sm:text-4xl flex items-center gap-3">
            <Receipt size={32} className="text-cyan-300" />
            Facturation
          </h1>
          <p className="mt-2 text-sm text-white/45">Toutes les factures émises — artistes, sponsors, partenaires.</p>
        </div>

        {/* KPIs */}
        {!loading && invoices.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="glass-card p-4">
              <Euro size={16} className="text-white/30 mb-2" />
              <div className="text-2xl font-black">{totalAll.toFixed(2).replace(".", ",")} €</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/35 mt-1">Total émis TTC</div>
            </div>
            <div className="glass-card p-4">
              <CheckCircle size={16} className="text-green-400 mb-2" />
              <div className="text-2xl font-black text-green-400">{totalPaid.toFixed(2).replace(".", ",")} €</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/35 mt-1">Encaissé TTC</div>
            </div>
            <div className="glass-card p-4 col-span-2 sm:col-span-1">
              <Clock size={16} className="text-yellow-400 mb-2" />
              <div className="text-2xl font-black text-yellow-400">{totalPending.toFixed(2).replace(".", ",")} €</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/35 mt-1">En attente TTC</div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          <label className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-3 text-white/30" size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="form-input pl-9 text-sm" placeholder="Rechercher client, numéro, prestation..." />
          </label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-input text-sm min-w-40">
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING_PAYMENT">En attente</option>
            <option value="PAID">Payé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-input text-sm min-w-36">
            <option value="ALL">Tous les types</option>
            <option value="ARTIST">Artiste</option>
            <option value="SPONSOR">Sponsor</option>
          </select>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl h-24 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Receipt size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">{invoices.length === 0 ? "Aucune facture émise pour le moment" : "Aucune facture ne correspond aux filtres"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv) => {
              const cfg = statusConfig[inv.status];
              const StatusIcon = cfg.Icon;
              return (
                <div
                  key={inv.id}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-sm font-bold text-white">{inv.invoiceNumber}</span>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon size={10} />
                          {cfg.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                          {inv.type === "ARTIST" ? "Artiste" : "Sponsor"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white/80 mb-0.5">{inv.clientName}</p>
                      <p className="text-xs text-white/35">{inv.clientEmail}</p>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(inv.invoiceDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                        {inv.sentAt && <span className="ml-2 text-white/25">· Envoyée</span>}
                        {inv.paidAt && <span className="ml-2 text-green-400/60">· Payée le {new Date(inv.paidAt).toLocaleDateString("fr-FR")}</span>}
                      </p>
                      <p className="text-xs text-white/35 mt-1 truncate">{inv.prestation}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-lg">{inv.priceTTC.toFixed(2).replace(".", ",")} €</div>
                      <div className="text-xs text-white/30">TTC</div>
                      <div className="text-xs text-white/20">HT {inv.priceHT.toFixed(2).replace(".", ",")} €</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-white/5">
                    <a
                      href={`/api/admin/invoices/${inv.id}/pdf?print=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/15 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      <Download size={11} />
                      PDF
                    </a>
                    {inv.status === "PENDING_PAYMENT" && (
                      <button onClick={() => updateStatus(inv.id, "PAID")} disabled={updating === inv.id}
                        className="flex items-center gap-1.5 text-xs text-green-400 border border-green-400/30 rounded-lg px-3 py-1.5 hover:bg-green-400/10 transition-colors disabled:opacity-50">
                        <CheckCircle size={11} /> Marquer payé
                      </button>
                    )}
                    {inv.status === "PAID" && (
                      <button onClick={() => updateStatus(inv.id, "PENDING_PAYMENT")} disabled={updating === inv.id}
                        className="flex items-center gap-1.5 text-xs text-yellow-400 border border-yellow-400/30 rounded-lg px-3 py-1.5 hover:bg-yellow-400/10 transition-colors disabled:opacity-50">
                        <RotateCcw size={11} /> En attente
                      </button>
                    )}
                    {inv.status !== "CANCELLED" && (
                      <button onClick={() => updateStatus(inv.id, "CANCELLED")} disabled={updating === inv.id}
                        className="flex items-center gap-1.5 text-xs text-red-400 border border-red-400/30 rounded-lg px-3 py-1.5 hover:bg-red-400/10 transition-colors disabled:opacity-50">
                        <XCircle size={11} /> Annuler
                      </button>
                    )}
                    {inv.status === "CANCELLED" && (
                      <button onClick={() => updateStatus(inv.id, "PENDING_PAYMENT")} disabled={updating === inv.id}
                        className="flex items-center gap-1.5 text-xs text-white/50 border border-white/15 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors disabled:opacity-50">
                        <RotateCcw size={11} /> Réactiver
                      </button>
                    )}
                    <button onClick={() => deleteInvoice(inv.id)} disabled={deleting === inv.id}
                      className="ml-auto flex items-center gap-1.5 text-xs text-red-400/60 border border-red-400/15 rounded-lg px-2 py-1.5 hover:bg-red-400/10 transition-colors disabled:opacity-50">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
