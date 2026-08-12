import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";
import { checkRateLimit } from "@/lib/rate-limit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActiveProductColors } from "@/lib/shop";

type CheckoutItem = {
  productId?: unknown;
  quantity?: unknown;
  size?: unknown;
  color?: unknown;
};

const text = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit(request, "shop-checkout", 8, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
      );
    }
    const body = (await request.json()) as Record<string, unknown>;
    const session = await getServerSession(authOptions);
    const rawItems = Array.isArray(body.items) ? (body.items as CheckoutItem[]).slice(0, 20) : [];
    const customerName = text(body.customerName, 140) || text(session?.user.name, 140);
    const customerEmail = (session?.user.email || text(body.customerEmail, 200)).toLowerCase();
    const addressLine1 = text(body.addressLine1, 240);
    const postalCode = text(body.postalCode, 30);
    const city = text(body.city, 120);
    const country = text(body.country, 120);
    const locale = ["fr", "en", "ko"].includes(String(body.locale)) ? String(body.locale) : "fr";

    if (!rawItems.length) throw new Error("Votre panier est vide.");
    if (body.termsAccepted !== true) throw new Error("Vous devez accepter les CGV avant de commander.");
    if (!customerName || !customerEmail.includes("@")) throw new Error("Nom et email valides requis.");
    if (!addressLine1 || !postalCode || !city || !country) throw new Error("Adresse de livraison incomplète.");

    const normalizedItems = rawItems.map((item) => ({
      productId: text(item.productId, 80),
      quantity: Math.max(1, Math.min(10, Math.trunc(Number(item.quantity ?? 1)) || 1)),
      size: text(item.size, 40) || null,
      color: text(item.color, 60) || null,
    }));
    const productIds = [...new Set(normalizedItems.map((item) => item.productId).filter(Boolean))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { orderBy: { order: "asc" } } },
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    const items = normalizedItems.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error("Un produit du panier n'est plus disponible.");
      if (product.sizes.length && (!item.size || !product.sizes.includes(item.size))) {
        throw new Error(`Choisissez une taille valide pour ${product.name}.`);
      }
      const activeColors = getActiveProductColors(product.colors, product.colorSettings);
      if (activeColors.length && (!item.color || !activeColors.includes(item.color))) {
        throw new Error(`Choisissez une couleur valide pour ${product.name}.`);
      }
      if (product.trackStock && item.quantity > product.stock) {
        throw new Error(`Stock insuffisant pour ${product.name}.`);
      }
      const image = item.color
        ? product.images.find((candidate) => candidate.color === item.color) || product.images.find((candidate) => !candidate.color)
        : product.images[0];
      return { ...item, product, image };
    });

    const currencies = new Set(items.map((item) => item.product.currency));
    if (currencies.size !== 1) throw new Error("Les produits doivent utiliser la même devise.");
    const currency = items[0].product.currency;
    const subtotalCents = items.reduce(
      (total, item) => total + item.product.priceCents * item.quantity,
      0,
    );
    const shippingCents = 0;
    const totalCents = subtotalCents + shippingCents;
    const orderNumber = `SS-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: "Le paiement est temporairement indisponible. Aucune commande n'a été créée." },
        { status: 503 },
      );
    }

    const order = await prisma.shopOrder.create({
      data: {
        userId: session?.user.id || null,
        orderNumber,
        customerName,
        customerEmail,
        phone: text(body.phone, 50) || null,
        addressLine1,
        addressLine2: text(body.addressLine2, 240) || null,
        postalCode,
        city,
        country,
        note: text(body.note, 1_500) || null,
        subtotalCents,
        shippingCents,
        totalCents,
        currency,
        termsAcceptedAt: new Date(),
        termsVersion: "2026-08-10",
        items: {
          create: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productSlug: item.product.slug,
            unitPriceCents: item.product.priceCents,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    const origin = new URL(request.url).origin;
    const confirmationUrl = `${origin}/${locale}/shop/confirmation?order=${encodeURIComponent(order.id)}`;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: order.id,
        customer_email: customerEmail,
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["FR", "BE", "ES", "IT", "DE", "NL", "LU", "PT", "CH", "GB", "KR"],
        },
        allow_promotion_codes: true,
        line_items: items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: item.product.currency.toLowerCase(),
            unit_amount: item.product.priceCents,
            product_data: {
              name: item.product.name,
              description: [item.size && `Taille ${item.size}`, item.color && `Couleur ${item.color}`]
                .filter(Boolean)
                .join(" · ") || undefined,
              images: item.image?.url ? [item.image.url] : undefined,
              metadata: { productId: item.product.id },
            },
          },
        })),
        metadata: { orderId: order.id, orderNumber },
        payment_intent_data: { metadata: { orderId: order.id, orderNumber } },
        success_url: `${confirmationUrl}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/${locale}/shop?checkout=cancelled`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });
      if (!session.url) throw new Error("Stripe n'a pas retourné d'URL de paiement.");
      await prisma.shopOrder.update({
        where: { id: order.id },
        data: { status: "AWAITING_PAYMENT", stripeSessionId: session.id },
      });
      return NextResponse.json({ url: session.url, orderNumber });
    } catch (stripeError) {
      await prisma.shopOrder.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      console.error("Stripe checkout unavailable", {
        type: stripeError instanceof Error ? stripeError.name : "UnknownError",
        message: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
      });
      return NextResponse.json(
        { error: "Le paiement est temporairement indisponible. Aucune somme n'a été débitée." },
        { status: 502 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Impossible de créer la commande." },
      { status: 400 },
    );
  }
}
