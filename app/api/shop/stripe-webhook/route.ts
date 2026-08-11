import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Signature manquante." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const paidEvent =
    event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded";
  const cancelledEvent =
    event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired";

  if (paidEvent) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.shopOrder.findFirst({
        where: { id: orderId, stripeSessionId: session.id },
        include: { items: true },
      });
      if (order && order.status !== "PAID") {
        await prisma.$transaction(async (transaction) => {
          for (const item of order.items) {
            if (!item.productId) continue;
            await transaction.product.updateMany({
              where: { id: item.productId, trackStock: true, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
          }
          await transaction.shopOrder.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              stripePaymentIntentId:
                typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
            },
          });
        });
      }
    }
  } else if (cancelledEvent) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.shopOrder.updateMany({
        where: { id: orderId, stripeSessionId: session.id, status: "AWAITING_PAYMENT" },
        data: { status: "CANCELLED" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
