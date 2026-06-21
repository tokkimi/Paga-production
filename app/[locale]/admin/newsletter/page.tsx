"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Send, Users } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [status, session, locale, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/admin/newsletter")
        .then((r) => r.json())
        .then((data) => setSubscribers(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });
      setSent(true);
      setSubject("");
      setContent("");
    } finally {
      setSending(false);
    }
  };

  const active = subscribers.filter((s) => s.isActive);

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
          <h1 className="text-3xl font-black uppercase">Newsletter</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total abonnés", value: subscribers.length, icon: Users },
            { label: "Actifs", value: active.length, icon: Mail },
            { label: "Inactifs", value: subscribers.length - active.length, icon: Mail },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-6 text-center">
                <Icon size={20} className="text-primary mx-auto mb-2" />
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Send size={18} className="text-primary" /> Envoyer une newsletter</h2>
          {sent ? (
            <div className="text-center py-6">
              <div className="text-green-400 font-medium mb-2">Newsletter envoyée !</div>
              <button onClick={() => setSent(false)} className="btn-secondary text-sm">Envoyer une autre</button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-white/60 block mb-1.5">Sujet *</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="form-input" placeholder="🎵 Nouvelles dates Paga Production" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/60 block mb-1.5">Contenu HTML *</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={8} className="form-input resize-none font-mono text-sm" placeholder="<h1>Bonjour !</h1>..." />
              </div>
              <button type="submit" disabled={sending} className="btn-primary">
                <Send size={16} />
                {sending ? "Envoi en cours..." : `Envoyer à ${active.length} abonnés`}
              </button>
            </form>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-bold mb-4">Liste des abonnés</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {subscribers.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/70">{s.email}</span>
                <span className={`text-xs font-semibold ${s.isActive ? "text-green-400" : "text-white/30"}`}>
                  {s.isActive ? "Actif" : "Inactif"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
