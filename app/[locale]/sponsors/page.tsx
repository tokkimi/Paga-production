"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  TrendingUp,
  Globe,
  Check,
  Send,
  Building2,
} from "lucide-react";

const tiers = [
  {
    name: "Bronze",
    price: "500",
    color: "#CD7F32",
    features: [
      "Logo sur nos réseaux sociaux",
      "Mention dans 2 stories Instagram",
      "Logo sur les flyers digitaux",
      "Rapport de campagne",
    ],
  },
  {
    name: "Silver",
    price: "1500",
    color: "#E63946",
    featured: true,
    features: [
      "Tout Bronze",
      "Logo sur les affiches d'événements",
      "Story dédiée par mois",
      "Repost sur compte Paga",
      "Accès backstage 1 event",
    ],
  },
  {
    name: "Gold",
    price: "5000",
    color: "#FFD700",
    features: [
      "Tout Silver",
      "Partenariat exclusif sur 3 mois",
      "Intégration dans les sets (visuel DJ)",
      "Contenu vidéo co-brandé",
      "2 billets VIP par événement",
      "Call mensuel stratégie",
    ],
  },
];

const stats = [
  { value: "50K+", label: "Followers Instagram" },
  { value: "15+", label: "Événements / an" },
  { value: "8", label: "Villes" },
  { value: "3", label: "Pays" },
];

export default function SponsorsPage() {
  const { data: session } = useSession();
  const locale = useLocale();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    contactEmail: "",
    phone: "",
    budget: "",
    customBudget: "",
    campaignType: "",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: form.budget === "custom" && form.customBudget ? `Budget personnalise: ${form.customBudget}` : form.budget,
          contactEmail: form.contactEmail || session?.user?.email,
        }),
      });
      if (res.ok || res.status === 201) {
        setStatus("success");
        setShowForm(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">
            Partenariats
          </p>
          <h1 className="section-title mb-4">Sponsors</h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Associez votre marque à l&apos;énergie de Paga Production et
            touchez des milliers de fans à travers la France et l&apos;Europe
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-3xl font-black text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-white/60 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-black uppercase text-center mb-12">
            Pourquoi nous rejoindre ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Audience Engagée",
                desc: "Une communauté passionée de musique électronique, 18-35 ans, active sur Instagram et présente aux festivals.",
              },
              {
                icon: TrendingUp,
                title: "Portée Croissante",
                desc: "Une présence en constante expansion : France, Belgique, Espagne, Ibiza. Chaque saison apporte de nouveaux marchés.",
              },
              {
                icon: Globe,
                title: "Visibilité Premium",
                desc: "Sur scène, sur les réseaux et en backstage. Un positionnement premium pour votre marque.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-black uppercase text-center mb-12">
            Offres de Partenariat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-8 relative ${tier.featured ? "border-primary/50 ring-1 ring-primary/30" : ""}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${tier.color}20` }}
                >
                  <Star size={20} style={{ color: tier.color }} fill={tier.color} />
                </div>

                <h3 className="text-2xl font-black uppercase mb-1" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <div className="text-3xl font-black mb-1">
                  €{tier.price}
                  <span className="text-sm font-normal text-white/50"> / an</span>
                </div>

                <ul className="space-y-3 mt-6 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{f}</span>
                    </li>
                  ))}
                </ul>

                {session ? (
                  <button onClick={() => setShowForm(true)} className="btn-primary w-full justify-center">
                    Choisir {tier.name}
                  </button>
                ) : (
                  <Link href={`/${locale}/connexion`} className="btn-secondary w-full text-center block">
                    Se connecter
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {showForm && session && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              Votre Proposition
            </h2>

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-green-400" />
                </div>
                <p className="text-green-400 font-medium">Proposition envoyée ! Nous vous contacterons sous 48h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Nom de la marque *</label>
                    <input type="text" required value={form.brandName} onChange={(e) => setForm((p) => ({ ...p, brandName: e.target.value }))} className="form-input" placeholder="Ma Marque" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Email de contact *</label>
                    <input type="email" required value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} className="form-input" placeholder={session.user.email || ""} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Téléphone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="+33 6 12 34 56 78" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Budget indicatif</label>
                    <select value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} className="form-input">
                      <option value="">Sélectionner...</option>
                      <option value="bronze">Bronze (€500)</option>
                      <option value="silver">Silver (€1500)</option>
                      <option value="gold">Gold (€5000)</option>
                      <option value="custom">Budget personnalisé</option>
                    </select>
                  </div>
                </div>
                {form.budget === "custom" && (
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1.5">Montant ou fourchette personnalisee</label>
                    <input type="text" value={form.customBudget} onChange={(e) => setForm((p) => ({ ...p, customBudget: e.target.value }))} className="form-input" placeholder="Ex: 2 500 EUR, 3 000-5 000 EUR, dotation produit..." />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">Type de campagne</label>
                  <input type="text" value={form.campaignType} onChange={(e) => setForm((p) => ({ ...p, campaignType: e.target.value }))} className="form-input" placeholder="Réseaux sociaux, événementiel, co-branding..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-1.5">Description *</label>
                  <textarea required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} className="form-input resize-none" placeholder="Décrivez votre marque et vos objectifs..." />
                </div>
                {status === "error" && <p className="text-red-400 text-sm">Une erreur est survenue. Réessayez.</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Annuler</button>
                  <button type="submit" disabled={status === "loading"} className="btn-primary flex-1 justify-center">
                    <Send size={16} />
                    {status === "loading" ? "Envoi..." : "Envoyer"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {!session && (
          <div className="text-center mt-8">
            <Link href={`/${locale}/connexion`} className="btn-primary text-base px-8 py-4 inline-flex">
              Se connecter pour proposer un partenariat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
