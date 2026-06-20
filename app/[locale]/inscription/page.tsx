"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, AlertCircle, User, Briefcase } from "lucide-react";

export default function InscriptionPage() {
  const locale = useLocale();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push(`/${locale}`);
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <div className="text-3xl font-black tracking-[0.15em] uppercase text-white">
              PAGA
            </div>
            <div className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
              PRODUCTION
            </div>
          </Link>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-black uppercase mb-2">Inscription</h1>
          <p className="text-white/60 text-sm mb-8">
            Rejoignez la communauté Paga Production
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "USER", label: "Fan / Spectateur", icon: User },
              { value: "BRAND", label: "Marque / Pro", icon: Briefcase },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: value }))}
                className={`p-4 rounded-xl border transition-all text-left ${
                  form.role === value
                    ? "border-primary bg-primary/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Icon
                  size={18}
                  className={form.role === value ? "text-primary" : "text-white/40"}
                />
                <p className="text-sm font-medium mt-2">{label}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/60 block mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className="form-input"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/60 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                className="form-input"
                placeholder="votre@email.fr"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/60 block mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  required
                  className="form-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/60 block mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-3">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Inscription...</span>
              ) : (
                <>
                  <UserPlus size={16} />
                  S&apos;inscrire
                </>
              )}
            </button>
          </form>

          <div className="border-t border-white/10 mt-6 pt-6 text-center">
            <p className="text-sm text-white/60">
              Déjà un compte ?{" "}
              <Link
                href={`/${locale}/connexion`}
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
