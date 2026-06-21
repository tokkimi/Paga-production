import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, CalendarDays, Music, Video, Building2, Mail, BarChart3, Mic } from "lucide-react";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  const [users, events, artists, tracks, videos, sponsors, subscribers] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.artist.count(),
    prisma.track.count(),
    prisma.video.count(),
    prisma.sponsorProposal.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  const cards = [
    { label: "Utilisateurs", value: users, icon: Users, href: `/${locale}/admin/utilisateurs`, color: "text-blue-400" },
    { label: "Événements", value: events, icon: CalendarDays, href: `/${locale}/admin/dates`, color: "text-purple-400" },
    { label: "Artistes", value: artists, icon: Mic, href: `/${locale}/admin/artistes`, color: "text-primary" },
    { label: "Morceaux", value: tracks, icon: Music, href: `/${locale}/admin/musique`, color: "text-green-400" },
    { label: "Vidéos", value: videos, icon: Video, href: `/${locale}/admin/videos`, color: "text-yellow-400" },
    { label: "Partenariats", value: sponsors, icon: Building2, href: `/${locale}/admin/partenariats`, color: "text-orange-400" },
    { label: "Abonnés NL", value: subscribers, icon: Mail, href: `/${locale}/admin/newsletter`, color: "text-pink-400" },
    { label: "Statistiques", value: "→", icon: BarChart3, href: `/${locale}/admin/statistiques`, color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-2">Administration</p>
          <h1 className="text-4xl font-black uppercase">Dashboard</h1>
          <p className="text-white/50 mt-1">Bienvenue, {session.user.name}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="glass-card p-6 hover:border-primary/40 transition-all group"
              >
                <div className={`mb-3 ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div className="text-3xl font-black mb-1 group-hover:text-primary transition-colors">
                  {card.value}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{card.label}</div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 glass-card p-6">
          <h2 className="font-bold mb-4">Navigation rapide</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Voir le site", href: `/${locale}` },
              { label: "Candidatures artistes", href: `/${locale}/admin/artistes` },
              { label: "Propositions marques", href: `/${locale}/admin/partenariats` },
              { label: "Newsletter", href: `/${locale}/admin/newsletter` },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="btn-secondary text-sm">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
