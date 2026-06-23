import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, CalendarDays, Music, Video, Building2, Mail, BarChart3, Mic, UserRoundSearch, Megaphone } from "lucide-react";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/" + locale);

  const [users, events, artists, tracks, videos, sponsors, subscribers, applications, campaigns, bookings] = await Promise.all([
    prisma.user.count(), prisma.event.count(), prisma.artist.count(), prisma.track.count(), prisma.video.count(),
    prisma.sponsorProposal.count(), prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.artistApplication.count(), prisma.campaign.count(), prisma.privateBooking.count(),
  ]);

  const cards = [
    { label: "CRM & sponsors", value: sponsors + campaigns + bookings, icon: Building2, href: "/" + locale + "/admin/partenariats", color: "text-orange-300" },
    { label: "Candidatures", value: applications, icon: UserRoundSearch, href: "/" + locale + "/admin/candidatures", color: "text-cyan-300" },
    { label: "Statistiques", value: "Live", icon: BarChart3, href: "/" + locale + "/admin/statistiques", color: "text-blue-300" },
    { label: "Événements publics", value: events, icon: CalendarDays, href: "/" + locale + "/admin/dates", color: "text-violet-300" },
    { label: "Artistes", value: artists, icon: Mic, href: "/" + locale + "/admin/artistes", color: "text-primary" },
    { label: "Morceaux", value: tracks, icon: Music, href: "/" + locale + "/admin/musique", color: "text-green-300" },
    { label: "Vidéos", value: videos, icon: Video, href: "/" + locale + "/admin/videos", color: "text-yellow-300" },
    { label: "Utilisateurs", value: users, icon: Users, href: "/" + locale + "/admin/utilisateurs", color: "text-blue-300" },
    { label: "Newsletter", value: subscribers, icon: Mail, href: "/" + locale + "/admin/newsletter", color: "text-pink-300" },
  ];

  return <div className="min-h-screen px-4 pb-28 pt-24"><div className="mx-auto max-w-7xl">
    <div className="mb-9"><p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-300">Administration</p><h1 className="mt-2 text-4xl font-black uppercase">Paga Control Room</h1><p className="mt-2 text-white/45">Bienvenue {session.user.name || session.user.email}. Toute l'activité est centralisée ici.</p></div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <Link key={card.label} href={card.href} className="glass-card group p-5 transition-all hover:border-cyan-200/35"><Icon size={22} className={"mb-4 " + card.color} /><div className="text-3xl font-black transition-colors group-hover:text-cyan-200">{card.value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">{card.label}</div></Link>; })}</div>
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      <Link href={"/" + locale + "/admin/partenariats"} className="glass-card p-6"><Megaphone className="mb-4 text-orange-300" /><h2 className="font-bold">Piloter le business</h2><p className="mt-2 text-sm text-white/45">Opportunités, campagnes, bookings, budgets, livrables et documents.</p></Link>
      <Link href={"/" + locale + "/admin/candidatures"} className="glass-card p-6"><UserRoundSearch className="mb-4 text-cyan-300" /><h2 className="font-bold">Examiner les talents</h2><p className="mt-2 text-sm text-white/45">Écoute, liens, notes, notation, statut et prochaine action.</p></Link>
      <Link href={"/" + locale + "/admin/statistiques"} className="glass-card p-6"><BarChart3 className="mb-4 text-blue-300" /><h2 className="font-bold">Comprendre l'audience</h2><p className="mt-2 text-sm text-white/45">Visites, pays, villes, appareils, sources et clics.</p></Link>
    </div>
  </div></div>;
}
