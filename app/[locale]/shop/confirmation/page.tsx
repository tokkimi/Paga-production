import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/shop";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confirmation de commande", robots: { index: false, follow: false } };

const copy = {
  fr: { title: "Commande enregistrée", paid: "Ton paiement a été reçu ou est en cours de confirmation.", pending: "Ta commande est bien enregistrée. L'équipe te contactera pour confirmer la disponibilité, la livraison et le paiement.", number: "Commande", total: "Total", back: "Retour au shop" },
  en: { title: "Order received", paid: "Your payment has been received or is being confirmed.", pending: "Your order has been received. The team will contact you to confirm availability, delivery and payment.", number: "Order", total: "Total", back: "Back to shop" },
  ko: { title: "주문이 접수되었습니다", paid: "결제가 접수되었거나 확인 중입니다.", pending: "주문이 접수되었습니다. 재고, 배송 및 결제 확인을 위해 팀에서 연락드리겠습니다.", number: "주문", total: "합계", back: "샵으로 돌아가기" },
};

export default async function ConfirmationPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ order?: string; session_id?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const labels = copy[locale as keyof typeof copy] ?? copy.fr;
  const order = query.order ? await prisma.shopOrder.findUnique({ where: { id: query.order }, include: { items: true } }) : null;
  const paidFlow = Boolean(query.session_id) || order?.status === "PAID" || order?.status === "AWAITING_PAYMENT";

  return (
    <div className="sherrie-page flex min-h-screen items-center justify-center px-4 pb-48 pt-28">
      <div className="shop-product-panel w-full max-w-xl rounded-[32px] border border-[#c85586]/18 bg-white/25 p-7 text-center shadow-[0_30px_100px_rgba(60,30,45,.12)] backdrop-blur-xl sm:p-10">
        {paidFlow ? <CheckCircle2 size={44} className="mx-auto text-emerald-500" /> : <Clock3 size={44} className="mx-auto text-[#c85586]" />}
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.36em] text-[#c85586]">Sherrie Shop</p>
        <h1 className="mt-3 text-3xl font-black uppercase">{labels.title}</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 opacity-62">{paidFlow ? labels.paid : labels.pending}</p>
        {order ? (
          <div className="mt-7 rounded-2xl border border-[#c85586]/12 bg-white/20 p-5 text-left">
            <div className="flex justify-between gap-4 text-sm"><span className="opacity-55">{labels.number}</span><strong>{order.orderNumber}</strong></div>
            <div className="mt-3 flex justify-between gap-4 border-t border-[#c85586]/10 pt-3 text-sm"><span className="opacity-55">{labels.total}</span><strong className="text-[#c85586]">{formatPrice(order.totalCents, order.currency, locale)}</strong></div>
          </div>
        ) : null}
        <Link href={`/${locale}/shop`} className="mt-8 inline-flex rounded-full border border-[#c85586]/38 px-6 py-3 text-xs font-black uppercase tracking-wider text-[#a75177]">{labels.back}</Link>
      </div>
    </div>
  );
}
