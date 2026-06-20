"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";

interface Proposal {
  id: string;
  brandName: string;
  status: string;
  createdAt: string;
  amount?: number;
  description: string;
  contactEmail: string;
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
          <Link href={`/${locale}/sponsors`} className="btn-primary">
            <Plus size={16} /> Nouvelle proposition
          </Link>
        </div>

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
            <Link href={`/${locale}/sponsors`} className="btn-primary inline-flex">Soumettre une proposition</Link>
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
                      {proposal.adminNote && (
                        <div className="glass-card px-4 py-2 rounded-lg text-xs text-white/70 mb-3">
                          <span className="font-semibold text-primary">Note admin : </span>{proposal.adminNote}
                        </div>
                      )}
                      <div className="text-xs text-white/40">Soumis le {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                    {proposal.amount && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-black text-primary">€{proposal.amount}</div>
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
