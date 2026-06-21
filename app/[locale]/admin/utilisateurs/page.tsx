"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Trash2, ShieldCheck } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUtilisateursPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") router.push(`/${locale}`);
  }, [status, session, locale, router]);

  const load = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (session) load(); }, [session]);

  const handleRole = async (id: string, role: string) => {
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    load();
  };

  const roleColors: Record<string, string> = {
    ADMIN: "text-primary border-primary/30 bg-primary/10",
    BRAND: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    USER: "text-white/50 border-white/10 bg-white/5",
  };

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-white/40">Chargement...</div></div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
          <h1 className="text-3xl font-black uppercase">Utilisateurs</h1>
          <p className="text-white/50 mt-1">{users.length} comptes</p>
        </div>

        <div className="space-y-3">
          {users.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {(u.name || u.email)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{u.name || "Sans nom"}</div>
                <div className="text-xs text-white/50 truncate">{u.email}</div>
              </div>
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded border ${roleColors[u.role] || roleColors.USER}`}>{u.role}</span>
              <div className="flex gap-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRole(u.id, e.target.value)}
                  className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white/70"
                >
                  <option value="USER">USER</option>
                  <option value="BRAND">BRAND</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button onClick={() => handleDelete(u.id)} disabled={u.id === session?.user.id} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
