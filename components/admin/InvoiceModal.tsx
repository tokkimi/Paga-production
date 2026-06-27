"use client";

import { useState, useEffect, useRef } from "react";
import { X, FileText, Send, CheckCircle, ArrowLeft, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateInvoiceHtml } from "@/lib/invoice-template";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "ARTIST" | "SPONSOR";
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  artistId?: string;
  sponsorId?: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  type,
  clientName = "",
  clientEmail = "",
  clientPhone = "",
  artistId,
  sponsorId,
}: InvoiceModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sending, setSending] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<{ id: string; invoiceNumber: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const prevUrlRef = useRef<string>("");

  const [form, setForm] = useState({
    clientName,
    clientEmail,
    clientPhone,
    clientAddress: "",
    prestation: "",
    priceHT: "",
    tvaRate: "20",
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCreatedInvoice(null);
      setForm((p) => ({ ...p, clientName, clientEmail, clientPhone }));
    }
  }, [isOpen, clientName, clientEmail, clientPhone]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  const priceHTNum = parseFloat(form.priceHT) || 0;
  const tvaRateNum = parseFloat(form.tvaRate) || 20;
  const tvaAmount = Math.round(priceHTNum * (tvaRateNum / 100) * 100) / 100;
  const priceTTC = Math.round((priceHTNum + tvaAmount) * 100) / 100;

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const previewNumber = `PAGA2026-XXXX`;

    const html = generateInvoiceHtml({
      invoiceNumber: previewNumber,
      invoiceDate: today,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      clientAddress: form.clientAddress,
      prestation: form.prestation,
      priceHT: priceHTNum,
      tvaRate: tvaRateNum,
      priceTTC,
    });

    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    prevUrlRef.current = url;
    setPreviewUrl(url);
    setStep(2);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const createRes = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          clientPhone: form.clientPhone,
          clientAddress: form.clientAddress,
          prestation: form.prestation,
          priceHT: priceHTNum,
          tvaRate: tvaRateNum,
          artistId,
          sponsorId,
        }),
      });

      if (!createRes.ok && createRes.status !== 201) {
        setSending(false);
        return;
      }

      const invoice = await createRes.json();
      setCreatedInvoice(invoice);

      const sendRes = await fetch(`/api/admin/invoices/${invoice.id}/send`, {
        method: "POST",
      });

      if (sendRes.ok) {
        setStep(3);
      }
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCreatedInvoice(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <FileText size={15} className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-sm">
                  {step === 1 && "Émettre une facture"}
                  {step === 2 && "Vérification"}
                  {step === 3 && "Facture envoyée"}
                </h2>
                <p className="text-xs text-white/40">
                  {type === "ARTIST" ? "Artiste" : "Sponsor / Partenaire"}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="text-white/30 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {/* STEP 1: Form */}
            {step === 1 && (
              <form onSubmit={handlePreview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1.5">
                      Nom du client *
                    </label>
                    <input
                      type="text"
                      value={form.clientName}
                      onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
                      required
                      className="form-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) => setForm((p) => ({ ...p, clientEmail: e.target.value }))}
                      required
                      className="form-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      value={form.clientPhone}
                      onChange={(e) => setForm((p) => ({ ...p, clientPhone: e.target.value }))}
                      className="form-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1.5">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={form.clientAddress}
                      onChange={(e) => setForm((p) => ({ ...p, clientAddress: e.target.value }))}
                      className="form-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/50 block mb-1.5">
                    Prestation *
                  </label>
                  <textarea
                    value={form.prestation}
                    onChange={(e) => setForm((p) => ({ ...p, prestation: e.target.value }))}
                    required
                    rows={3}
                    placeholder="Description de la prestation..."
                    className="form-input text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1.5">
                      Prix HT (€) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.priceHT}
                      onChange={(e) => setForm((p) => ({ ...p, priceHT: e.target.value }))}
                      required
                      className="form-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 block mb-1.5">
                      TVA (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.tvaRate}
                      onChange={(e) => setForm((p) => ({ ...p, tvaRate: e.target.value }))}
                      className="form-input text-sm"
                    />
                  </div>
                  <div className="sm:col-span-1 col-span-2">
                    <label className="text-xs font-semibold text-white/50 block mb-1.5">
                      Total TTC
                    </label>
                    <div
                      className="form-input text-sm font-bold text-primary"
                      style={{ background: "rgba(59,130,246,0.05)", userSelect: "none" }}
                    >
                      {priceHTNum > 0 ? `${priceTTC.toFixed(2).replace(".", ",")} €` : "—"}
                    </div>
                  </div>
                </div>

                {priceHTNum > 0 && (
                  <div
                    className="rounded-xl px-4 py-3 text-xs text-white/50 space-y-1"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex justify-between">
                      <span>Sous-total HT</span>
                      <span>{priceHTNum.toFixed(2).replace(".", ",")} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA {tvaRateNum}%</span>
                      <span>{tvaAmount.toFixed(2).replace(".", ",")} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-white/80 pt-1 border-t border-white/8">
                      <span>TOTAL TTC</span>
                      <span>{priceTTC.toFixed(2).replace(".", ",")} €</span>
                    </div>
                  </div>
                )}

                <div
                  className="rounded-xl px-4 py-3 text-xs text-white/40"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-white/25">N° facture</span>{" "}
                  <span className="font-mono">PAGA2026-XXXX</span>
                  {"  ·  "}
                  <span className="text-white/25">Date</span>{" "}
                  {new Date().toLocaleDateString("fr-FR")}
                  {"  ·  "}
                  <span className="text-white/25">TVA</span>{" "}
                  SIRET 837 496 629 00044
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleClose} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex-1 justify-center">
                    Vérifier la facture
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Preview */}
            {step === 2 && (
              <div>
                <p className="text-xs text-white/40 mb-3">
                  Vérifiez la facture avant envoi. Le numéro définitif sera attribué à l&apos;envoi.
                </p>
                <iframe
                  src={previewUrl}
                  className="w-full rounded-xl"
                  style={{ height: "520px", border: "none", background: "#fff" }}
                  title="Aperçu facture"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ArrowLeft size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className="btn-primary flex-1 justify-center"
                  >
                    <Send size={14} />
                    {sending ? "Envoi en cours…" : `Envoyer à ${form.clientEmail}`}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && createdInvoice && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Facture envoyée !</h3>
                <p className="text-white/50 text-sm mb-1">
                  N°{" "}
                  <span className="font-mono font-bold text-white/80">
                    {createdInvoice.invoiceNumber}
                  </span>
                </p>
                <p className="text-white/40 text-xs mb-6">
                  Envoyée à {form.clientEmail}
                </p>
                <div className="flex gap-3 justify-center">
                  <a
                    href={`/api/admin/invoices/${createdInvoice.id}/pdf?print=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Download size={14} />
                    Télécharger PDF
                  </a>
                  <button onClick={handleClose} className="btn-primary">
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
