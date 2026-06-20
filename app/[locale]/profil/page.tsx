import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User, Mail, Bell } from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfilPage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/${locale}/connexion`);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true, avatar: true },
  });

  const newsletter = await prisma.newsletterSubscriber.findUnique({
    where: { email: session.user.email },
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-8">Mon Profil</h1>

        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || ""}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={28} className="text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-sm text-white/60">{user?.email}</p>
              <span className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 rounded px-2 py-0.5 mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <Mail size={16} className="text-primary flex-shrink-0" />
              {user?.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <Bell size={16} className="text-primary flex-shrink-0" />
              Newsletter:{" "}
              {newsletter?.isActive ? (
                <span className="text-green-400">Abonné(e)</span>
              ) : (
                <span className="text-white/40">Non abonné(e)</span>
              )}
            </div>
            <div className="text-xs text-white/40 pt-2">
              Membre depuis le{" "}
              {user?.createdAt.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="font-bold mb-4">Actions rapides</h3>
          <div className="space-y-2">
            <a
              href={`/${locale}/dates`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-white/80"
            >
              Voir les prochaines dates
            </a>
            <a
              href={`/${locale}/rejoindre`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-white/80"
            >
              Soumettre une candidature artiste
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
