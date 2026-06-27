"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Clock, XCircle, Download, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  prestation: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELLED";
  sentAt: string | null;
  paidAt: string | null;
}

interface InvoicesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientEmail: string;
  clientName: string;
}

const statusConfig = {
  PENDING_PAYMENT: {
    label: "En attente de paiement",
    color: "text-yellow-400",
    border: "border-yellow-400/30",
    bg: "hover:bg-yellow-400/10",
    Icon: Clock,
  },
  PAID: {
    label: "Payé",
    color: "text-green-400",
    border: "border-green-400/30",
    bg: "hover:bg-green-400/10",
    Icon: CheckCircle,
  },
  CANCELLED: {
    label: "Annulé",
    color: "text-red-400",
    border: "border-red-400/30",
    bg: "hover:bg-red-400/10",
    Icon: XCircle,
  },
};

export default function InvoicesListModal({
  isOpen,
  onClose,
  clientEmail,
  clientName,
}: InvoicesListModalProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !clientEmail) return;
    setLoading(true);
    fetch(`/api/admin/invoices?clientEmail=${encodeURIComponent(clientEmail)}`)
      .then((r) => r.json())
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, [isOpen, clientEmail]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === id ? { ...inv, status: updated.status, paidAt: updated.paidAt } : inv
          )
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  if (!isOpen) return null;

  const totalPaid = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + i.priceTTC, 0);

  const totalPending = invoices
    .filter((i) => i.status === "PENDING_PAYMENT")
    .reduce((s, i) => s + i.priceTTC, 0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl"
          style={{
            background: "rgba(6, 8, 15, 0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <div>
              <h2 className="font-bold text-sm">Factures émises</h2>
              <p className="text-xs text-white/40">
                {clientName} — {clientEmail}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Summary */}
          {invoices.length > 0 && (
            <div
              className="flex gap-4 px-6 py-3 border-b border-white/5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {totalPaid > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle size={11} className="text-green-400" />
                  <span className="text-white/40">Payé :</span>
                  <span className="text-green-400 font-semibold">
                    {totalPaid.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
              )}
              {totalPending > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock size={11} className="text-yellow-400" />
                  <span className="text-white/40">En attente :</span>
                  <span className="text-yellow-400 font-semibold">
                    {totalPending.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-6 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl h-20 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center text-white/30 py-12 text-sm">
                Aucune facture émise pour ce client
              </div>
            ) : (
              invoices.map((inv) => {
                const cfg = statusConfig[inv.status];
                const StatusIcon = cfg.Icon;
                return (
                  <div
                    key={inv.id}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-sm font-bold text-white">
                            {inv.invoiceNumber}
                          </span>
                          <div className={`flex items-center gap-1 text-xs font-semibold ${cfg.color}`}>
                            <StatusIcon size={11} />
                            {cfg.label}
                          </div>
                        </div>
                        <p className="text-xs text-white/40 mb-1">
                          {new Date(inv.invoiceDate).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                          {inv.sentAt && (
                            <span className="ml-2 text-white/25">· Envoyée</span>
                          )}
                          {inv.paidAt && (
                            <span className="ml-2 text-green-400/60">
                              · Payée le{" "}
                              {new Date(inv.paidAt).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-white/40 truncate">{inv.prestation}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm">
                          {inv.priceTTC.toFixed(2).replace(".", ",")} €
                        </div>
                        <div className="text-xs text-white/30">TTC</div>
                        <div className="text-xs text-white/20">
                          HT {inv.priceHT.toFixed(2).replace(".", ",")} €
                        </div>
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
                        <button
                          onClick={() => updateStatus(inv.id, "PAID")}
                          disabled={updating === inv.id}
                          className="flex items-center gap-1.5 text-xs text-green-400 border border-green-400/30 rounded-lg px-3 py-1.5 hover:bg-green-400/10 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={11} />
                          Marquer payé
                        </button>
                      )}

                      {inv.status === "PAID" && (
                        <button
                          onClick={() => updateStatus(inv.id, "PENDING_PAYMENT")}
                          disabled={updating === inv.id}
                          className="flex items-center gap-1.5 text-xs text-yellow-400 border border-yellow-400/30 rounded-lg px-3 py-1.5 hover:bg-yellow-400/10 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw size={11} />
                          En attente
                        </button>
                      )}

                      {inv.status !== "CANCELLED" && (
                        <button
                          onClick={() => updateStatus(inv.id, "CANCELLED")}
                          disabled={updating === inv.id}
                          className="flex items-center gap-1.5 text-xs text-red-400 border border-red-400/30 rounded-lg px-3 py-1.5 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={11} />
                          Annuler
                        </button>
                      )}

                      {inv.status === "CANCELLED" && (
                        <button
                          onClick={() => updateStatus(inv.id, "PENDING_PAYMENT")}
                          disabled={updating === inv.id}
                          className="flex items-center gap-1.5 text-xs text-white/50 border border-white/15 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw size={11} />
                          Réactiver
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
