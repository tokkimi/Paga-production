import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, Mail, PackageCheck, ShoppingBag, User } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/shop";
import FavoriteButton from "@/components/shop/FavoriteButton";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

const copy = {
  fr: {
    title: "Mon profil",
    memberSince: "Membre depuis le",
    newsletter: "Newsletter",
    subscribed: "Abonné(e)",
    notSubscribed: "Non abonné(e)",
    favorites: "Mes favoris",
    noFavorites: "Aucun favori pour le moment.",
    browse: "Découvrir la boutique",
    orders: "Mes commandes",
    noOrders: "Aucune commande pour le moment.",
    order: "Commande",
    quick: "Actions rapides",
    dates: "Voir les prochaines dates",
    apply: "Soumettre une candidature artiste",
  },
  en: {
    title: "My profile",
    memberSince: "Member since",
    newsletter: "Newsletter",
    subscribed: "Subscribed",
    notSubscribed: "Not subscribed",
    favorites: "My favourites",
    noFavorites: "No favourites yet.",
    browse: "Browse the shop",
    orders: "My orders",
    noOrders: "No orders yet.",
    order: "Order",
    quick: "Quick actions",
    dates: "View upcoming dates",
    apply: "Submit an artist application",
  },
  ko: {
    title: "My profile",
    memberSince: "Member since",
    newsletter: "Newsletter",
    subscribed: "Subscribed",
    notSubscribed: "Not subscribed",
    favorites: "My favourites",
    noFavorites: "No favourites yet.",
    browse: "Browse the shop",
    orders: "My orders",
    noOrders: "No orders yet.",
    order: "Order",
    quick: "Quick actions",
    dates: "View upcoming dates",
    apply: "Submit an artist application",
  },
};

const statusLabels: Record<string, Record<string, string>> = {
  fr: { PENDING: "En attente", AWAITING_PAYMENT: "Paiement en cours", PAID: "Payée", PROCESSING: "En préparation", SHIPPED: "Expédiée", COMPLETED: "Terminée", CANCELLED: "Annulée" },
  en: { PENDING: "Pending", AWAITING_PAYMENT: "Payment pending", PAID: "Paid", PROCESSING: "Processing", SHIPPED: "Shipped", COMPLETED: "Completed", CANCELLED: "Cancelled" },
  ko: { PENDING: "Pending", AWAITING_PAYMENT: "Payment pending", PAID: "Paid", PROCESSING: "Processing", SHIPPED: "Shipped", COMPLETED: "Completed", CANCELLED: "Cancelled" },
};

export default async function ProfilPage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/connexion?callbackUrl=${encodeURIComponent(`/${locale}/profil`)}`);

  const labels = copy[locale as keyof typeof copy] || copy.fr;
  const language = ["fr", "en", "ko"].includes(locale) ? locale : "fr";
  const [user, newsletter, favorites, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, avatar: true },
    }),
    prisma.newsletterSubscriber.findUnique({ where: { email: session.user.email } }),
    prisma.productFavorite.findMany({
      where: { userId: session.user.id, product: { isActive: true } },
      include: { product: { include: { images: { orderBy: { order: "asc" }, take: 1 } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shopOrder.findMany({
      where: { OR: [{ userId: session.user.id }, { customerEmail: session.user.email.toLowerCase() }] },
      include: { items: { orderBy: { id: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="sherrie-page min-h-screen px-4 pb-56 pt-28 sm:px-6 sm:pb-40">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">{labels.title}</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
          <aside className="space-y-6">
            <section className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-5">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20">
                  {user?.avatar ? <Image src={user.avatar} alt={user.name || ""} fill sizes="64px" className="object-cover" /> : <User size={28} className="text-primary" />}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">{user?.name}</h2>
                  <p className="truncate text-sm opacity-60">{user?.email}</p>
                  <span className="mt-1 inline-block rounded border border-primary/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">{user?.role}</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm opacity-70"><Mail size={16} className="shrink-0 text-primary" />{user?.email}</div>
                <div className="flex items-center gap-3 text-sm opacity-70"><Bell size={16} className="shrink-0 text-primary" />{labels.newsletter}: <span className={newsletter?.isActive ? "text-green-400" : "opacity-55"}>{newsletter?.isActive ? labels.subscribed : labels.notSubscribed}</span></div>
                <p className="pt-2 text-xs opacity-45">{labels.memberSince} {user?.createdAt.toLocaleDateString(language === "ko" ? "ko-KR" : `${language}-${language === "en" ? "GB" : "FR"}`, { day: "2-digit", month: "long", year: "numeric" })}</p>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="font-bold">{labels.quick}</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Link href={`/${locale}/shop`} className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/5"><ShoppingBag size={16} />{labels.browse}</Link>
                <Link href={`/${locale}/dates`} className="block rounded-xl px-4 py-3 transition hover:bg-white/5">{labels.dates}</Link>
                <Link href={`/${locale}/rejoindre`} className="block rounded-xl px-4 py-3 transition hover:bg-white/5">{labels.apply}</Link>
              </div>
            </section>
          </aside>

          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center gap-3"><Heart className="text-[#ef6aa4]" /><h2 className="text-2xl font-black uppercase">{labels.favorites}</h2></div>
              {favorites.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {favorites.map(({ product }) => {
                    const name = locale === "en" ? product.nameEn || product.name : locale === "ko" ? product.nameKo || product.name : product.name;
                    return (
                      <article key={product.id} className="relative overflow-hidden rounded-2xl border border-[#c85586]/15 bg-white/20 backdrop-blur-xl">
                        <Link href={`/${locale}/shop/${product.slug}`} className="grid grid-cols-[108px_1fr] gap-4 p-3">
                          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white/15">{product.images[0] ? <Image src={product.images[0].url} alt={product.images[0].alt || name} fill sizes="108px" className="object-contain p-1" /> : null}</div>
                          <div className="min-w-0 self-center pr-8"><p className="text-[9px] font-black uppercase tracking-wider text-[#c85586]">{product.collection}</p><h3 className="mt-1 line-clamp-2 font-black uppercase">{name}</h3><p className="mt-3 font-black text-[#c85586]">{formatPrice(product.priceCents, product.currency, locale)}</p></div>
                        </Link>
                        <FavoriteButton productId={product.id} className="absolute right-3 top-3 h-9 w-9" />
                      </article>
                    );
                  })}
                </div>
              ) : <div className="rounded-2xl border border-dashed border-[#c85586]/20 bg-white/10 p-8 text-center text-sm opacity-60"><p>{labels.noFavorites}</p><Link href={`/${locale}/shop`} className="mt-4 inline-block font-bold text-[#ef6aa4]">{labels.browse}</Link></div>}
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3"><PackageCheck className="text-[#ef6aa4]" /><h2 className="text-2xl font-black uppercase">{labels.orders}</h2></div>
              {orders.length ? <div className="space-y-4">{orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-[#c85586]/15 bg-white/20 p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#c85586]/12 pb-4">
                    <div><p className="text-[9px] font-black uppercase tracking-wider opacity-50">{labels.order}</p><h3 className="font-black">{order.orderNumber}</h3><p className="mt-1 text-xs opacity-50">{order.createdAt.toLocaleDateString(language === "ko" ? "ko-KR" : `${language}-${language === "en" ? "GB" : "FR"}`)}</p></div>
                    <div className="text-right"><span className="rounded-full bg-[#ef6aa4]/15 px-3 py-1 text-[10px] font-black uppercase text-[#ef6aa4]">{statusLabels[language]?.[order.status] || order.status}</span><p className="mt-3 font-black">{formatPrice(order.totalCents, order.currency, locale)}</p></div>
                  </div>
                  <ul className="mt-4 space-y-2">{order.items.map((item) => <li key={item.id} className="flex items-start justify-between gap-3 text-sm"><div><Link href={`/${locale}/shop/${item.productSlug}`} className="font-bold hover:text-[#ef6aa4]">{item.productName}</Link><p className="text-xs opacity-45">{[item.size && `Taille ${item.size}`, item.color && `Couleur ${item.color}`].filter(Boolean).join(" · ")}</p></div><span className="shrink-0 opacity-65">× {item.quantity}</span></li>)}</ul>
                </article>
              ))}</div> : <div className="rounded-2xl border border-dashed border-[#c85586]/20 bg-white/10 p-8 text-center text-sm opacity-60">{labels.noOrders}</div>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
