"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Plus, Send, X } from "lucide-react";

interface Proposal {
  id: string;
  brandName: string;
  status: string;
  createdAt: string;
  amount?: number;
  description: string;
  contactEmail: string;
  budget?: string;
  campaignType?: string;
  adminNote?: string;
}

const statusConfig = {
  PENDING: { label: "En attente", icon: Clock, color: "text-yellow-400" },
  REVIEWING: { label: "En cours d'examen", icon: AlertCircle, color: "text-blue-400" },
  VALIDATED: { label: "Validé", icon: CheckCircle, color: "text-green-400" },
  REJECTED: { label: "Refusé", icon: XCircle, color: "text-red-400" },
};

export default function MarquePage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState({
    brandName: "",
    contactEmail: "",
    phone: "",
    budget: "",
    customBudget: "",
    campaignType: "",
    description: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/connexion`);
  }, [status, locale, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/sponsors")
        .then((r) => r.json())
        .then(setProposals)
        .finally(() => setLoading(false));
    }
  }, [session]);

  const loadProposals = () => {
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((data) => setProposals(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSubmitStatus("idle");
    const budget = form.budget;

    const res = await fetch("/api/sponsors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName: form.brandName,
        contactEmail: form.contactEmail || session?.user.email,
        phone: form.phone,
        budget,
        campaignType: form.campaignType,
        description: form.description,
      }),
    });

    setSaving(false);
    if (res.ok || res.status === 201) {
      setSubmitStatus("success");
      setShowForm(false);
      setForm({ brandName: "", contactEmail: "", phone: "", budget: "", customBudget: "", campaignType: "", description: "" });
      loadProposals();
    } else {
      setSubmitStatus("error");
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase">Espace Marque</h1>
            <p className="text-white/60 mt-1">Gérez vos propositions de partenariat</p>
          </div>
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            <Plus size={16} /> Nouvelle proposition
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-card mb-8 p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Proposition de collaboration</h2>
                <p className="mt-1 text-sm text-white/50">Brief marque, budget, campagne et objectif.</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary p-2">
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">Nom de la marque *</label>
                <input required value={form.brandName} onChange={(e) => setForm((p) => ({ ...p, brandName: e.target.value }))} className="form-input" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">Email de contact *</label>
                <input type="email" required value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} className="form-input" placeholder={session?.user.email || ""} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">Telephone</label>
                <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="+33 6 12 34 56 78" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">Budget</label>
                <input value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} className="form-input" placeholder="Ex: budget sur mesure, dotation produit, enveloppe evenement..." />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-white/60">Type de campagne</label>
                <input value={form.campaignType} onChange={(e) => setForm((p) => ({ ...p, campaignType: e.target.value }))} className="form-input" placeholder="Reseaux sociaux, event, co-branding, placement..." />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-white/60">Description *</label>
                <textarea required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} className="form-input resize-none" placeholder="Objectif, public vise, dates souhaitees, idees de campagne..." />
              </div>
            </div>

            {submitStatus === "error" && <p className="mt-4 text-sm text-red-400">La proposition n'a pas pu etre envoyee.</p>}
            {submitStatus === "success" && <p className="mt-4 text-sm text-green-400">Proposition envoyee.</p>}

            <div className="mt-5 flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary justify-center">
                <Send size={15} />
                {saving ? "Envoi..." : "Envoyer la proposition"}
              </button>
            </div>
          </motion.form>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Briefcase size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-4">Aucune proposition en cours</p>
            <button onClick={() => setShowForm(true)} className="btn-primary inline-flex">Soumettre une proposition</button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, i) => {
              const cfg = statusConfig[proposal.status as keyof typeof statusConfig];
              const StatusIcon = cfg?.icon || Clock;
              return (
                <motion.div key={proposal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{proposal.brandName}</h3>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${cfg?.color}`}>
                          <StatusIcon size={13} />{cfg?.label}
                        </div>
                      </div>
                      <p className="text-sm text-white/60 line-clamp-2 mb-3">{proposal.description}</p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {proposal.budget && <span className="rounded-full border border-cyan-200/15 bg-white/[0.04] px-3 py-1 text-xs text-white/55">{proposal.budget}</span>}
                        {proposal.campaignType && <span className="rounded-full border border-cyan-200/15 bg-white/[0.04] px-3 py-1 text-xs text-white/55">{proposal.campaignType}</span>}
                      </div>
                      {proposal.adminNote && (
                        <div className="glass-card px-4 py-2 rounded-lg text-xs text-white/70 mb-3">
                          <span className="font-semibold text-primary">Note admin : </span>{proposal.adminNote}
                        </div>
                      )}
                      <div className="text-xs text-white/40">Soumis le {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                    {proposal.amount && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-black text-primary">{proposal.amount}</div>
                        <div className="text-xs text-white/40">montant</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
