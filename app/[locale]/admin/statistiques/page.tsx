import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Eye, Users, Music } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminStatistiquesPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}`);

  const [totalUsers, totalEvents, totalTracks, totalVideos, totalSponsors, activeSubscribers] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.track.count(),
    prisma.video.count(),
    prisma.sponsorProposal.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { name: true, email: true, role: true, createdAt: true },
  });

  const stats = [
    { label: "Utilisateurs", value: totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Événements", value: totalEvents, icon: TrendingUp, color: "text-purple-400" },
    { label: "Morceaux", value: totalTracks, icon: Music, color: "text-green-400" },
    { label: "Vidéos", value: totalVideos, icon: Eye, color: "text-yellow-400" },
    { label: "Propositions", value: totalSponsors, icon: BarChart3, color: "text-orange-400" },
    { label: "Abonnés NL", value: activeSubscribers, icon: Users, color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Admin</p>
          <h1 className="text-3xl font-black uppercase">Statistiques</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-6">
                <Icon size={20} className={`mb-3 ${stat.color}`} />
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-bold mb-4">Derniers inscrits</h2>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-sm font-medium">{u.name || "Sans nom"}</div>
                  <div className="text-xs text-white/50">{u.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-primary">{u.role}</div>
                  <div className="text-xs text-white/40">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
