import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/shop";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confirmation de commande", robots: { index: false, follow: false } };

const copy = {
  fr: { paidTitle: "Paiement confirmé", pendingTitle: "Paiement en cours", cancelledTitle: "Paiement annulé", paid: "Ton paiement a bien été confirmé. La commande peut maintenant être préparée.", pending: "Stripe confirme encore le paiement. La commande passera automatiquement en payée dès validation.", cancelled: "Le paiement n'a pas abouti et aucune somme n'a été débitée. Tu peux revenir au shop et réessayer.", number: "Commande", total: "Total", back: "Retour au shop" },
  en: { paidTitle: "Payment confirmed", pendingTitle: "Payment processing", cancelledTitle: "Payment cancelled", paid: "Your payment has been confirmed. The order can now be prepared.", pending: "Stripe is still confirming the payment. The order will update automatically once validated.", cancelled: "The payment was not completed and no amount was charged. You can return to the shop and try again.", number: "Order", total: "Total", back: "Back to shop" },
  ko: { paidTitle: "결제 확인 완료", pendingTitle: "결제 처리 중", cancelledTitle: "결제 취소됨", paid: "결제가 확인되었습니다. 이제 주문 준비를 시작할 수 있습니다.", pending: "Stripe에서 결제를 확인 중입니다. 승인되면 주문 상태가 자동으로 변경됩니다.", cancelled: "결제가 완료되지 않았으며 청구된 금액이 없습니다. 샵으로 돌아가 다시 시도할 수 있습니다.", number: "주문", total: "합계", back: "샵으로 돌아가기" },
};

export default async function ConfirmationPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ order?: string; session_id?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const labels = copy[locale as keyof typeof copy] ?? copy.fr;
  const order = query.order ? await prisma.shopOrder.findUnique({ where: { id: query.order }, include: { items: true } }) : null;
  const isPaid = order?.status === "PAID";
  const isCancelled = order?.status === "CANCELLED";
  const title = isPaid ? labels.paidTitle : isCancelled ? labels.cancelledTitle : labels.pendingTitle;
  const message = isPaid ? labels.paid : isCancelled ? labels.cancelled : labels.pending;

  return (
    <div className="sherrie-page flex min-h-screen items-center justify-center px-4 pb-48 pt-28">
      <div className="shop-product-panel w-full max-w-xl rounded-[32px] border border-[#c85586]/18 bg-white/25 p-7 text-center shadow-[0_30px_100px_rgba(60,30,45,.12)] backdrop-blur-xl sm:p-10">
        {isPaid ? <CheckCircle2 size={44} className="mx-auto text-emerald-500" /> : isCancelled ? <XCircle size={44} className="mx-auto text-rose-500" /> : <Clock3 size={44} className="mx-auto text-[#c85586]" />}
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.36em] text-[#c85586]">Sherrie Shop</p>
        <h1 className="mt-3 text-3xl font-black uppercase">{title}</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 opacity-62">{message}</p>
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
