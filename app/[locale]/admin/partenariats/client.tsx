"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Clock, CheckCircle, XCircle, AlertCircle, FileText, Receipt } from "lucide-react";
import InvoiceModal from "@/components/admin/InvoiceModal";
import InvoicesListModal from "@/components/admin/InvoicesListModal";

interface Proposal {
  id: string;
  brandName: string;
  contactEmail: string;
  status: string;
  description: string;
  budget?: string;
  campaignType?: string;
  phone?: string;
  adminNote?: string;
  createdAt: string;
  user?: { name: string; email: string };
}

const statusConfig = {
  PENDING: { label: "En attente", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  REVIEWING: { label: "En examen", icon: AlertCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
  VALIDATED: { label: "Validé", icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
  REJECTED: { label: "Refusé", icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
};

export default function PartenariatsClient() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean; proposal: Proposal | null }>({ open: false, proposal: null });
  const [listModal, setListModal] = useState<{ open: boolean; proposal: Proposal | null }>({ open: false, proposal: null });

  const load = () => {
    fetch("/api/admin/sponsors")
      .then((r) => r.json())
      .then((data) => {
        setProposals(Array.isArray(data) ? data : []);
        const n: Record<string, string> = {};
        (Array.isArray(data) ? data : []).forEach((p: Proposal) => { n[p.id] = p.adminNote || ""; });
        setNotes(n);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/sponsors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNote: notes[id] }),
    });
    load();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
          <h1 className="text-3xl font-black uppercase">Partenariats</h1>
          <p className="text-white/50 mt-1">{proposals.length} proposition{proposals.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="space-y-4">
          {proposals.map((p, i) => {
            const cfg = statusConfig[p.status as keyof typeof statusConfig] || statusConfig.PENDING;
            const Icon = cfg.icon;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-bold">{p.brandName}</div>
                      <div className="text-xs text-white/50">{p.contactEmail}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}>
                    <Icon size={12} />
                    {cfg.label}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button onClick={() => setInvoiceModal({ open: true, proposal: p })} className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors" title="Émettre une facture"><FileText size={12} /> Facture</button>
                    <button onClick={() => setListModal({ open: true, proposal: p })} className="w-8 h-8 glass-card rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" title="Voir les factures"><Receipt size={14} className="text-white/50" /></button>
                  </div>
                </div>

                <p className="text-sm text-white/70 mb-3">{p.description}</p>

                {p.budget && <p className="text-xs text-white/50 mb-1">Budget: {p.budget}</p>}
                {p.campaignType && <p className="text-xs text-white/50 mb-3">Campagne: {p.campaignType}</p>}

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Note admin</label>
                    <textarea
                      value={notes[p.id] || ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      rows={2}
                      className="form-input resize-none text-sm"
                      placeholder="Note interne..."
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => updateStatus(p.id, key)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          p.status === key
                            ? `${val.color} ${val.bg} border-current`
                            : "border-white/10 text-white/50 hover:border-white/30"
                        }`}
                      >
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-white/30 mt-3">
                  Soumis le {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </motion.div>
            );
          })}

          {proposals.length === 0 && (
            <div className="glass-card p-12 text-center">
              <Building2 size={40} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/50">Aucune proposition pour le moment</p>
            </div>
          )}
        </div>
      </div>

      <InvoiceModal
        isOpen={invoiceModal.open}
        onClose={() => setInvoiceModal({ open: false, proposal: null })}
        type="SPONSOR"
        clientName={invoiceModal.proposal?.brandName ?? ""}
        clientEmail={invoiceModal.proposal?.contactEmail ?? ""}
        clientPhone={invoiceModal.proposal?.phone ?? ""}
        sponsorId={invoiceModal.proposal?.id}
      />

      <InvoicesListModal
        isOpen={listModal.open}
        onClose={() => setListModal({ open: false, proposal: null })}
        clientEmail={listModal.proposal?.contactEmail ?? ""}
        clientName={listModal.proposal?.brandName ?? ""}
      />
    </div>
  );
}
