"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/shop";
import type { CartItem } from "@/lib/shop-types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  openCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sherrie-shop-cart-v1";

const copy = {
  fr: {
    cart: "Panier",
    empty: "Ton panier est vide.",
    subtotal: "Sous-total",
    shipping: "Livraison",
    free: "Offerte",
    checkout: "Commander avec obligation de paiement",
    details: "Coordonnées et livraison",
    name: "Nom complet",
    email: "Email",
    phone: "Téléphone",
    address1: "Adresse",
    address2: "Complément d'adresse",
    postal: "Code postal",
    city: "Ville",
    country: "Pays",
    note: "Note de commande",
    required: "Merci de remplir les coordonnées de livraison.",
    terms: "J’ai lu et j’accepte les",
    termsRequired: "Merci d’accepter les CGV pour commander.",
    error: "Impossible de créer la commande.",
    loading: "Préparation...",
    continue: "Découvrir la collection",
  },
  en: {
    cart: "Cart",
    empty: "Your cart is empty.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    checkout: "Order with obligation to pay",
    details: "Contact and delivery",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    address1: "Address",
    address2: "Address line 2",
    postal: "Postal code",
    city: "City",
    country: "Country",
    note: "Order note",
    required: "Please complete the delivery details.",
    terms: "I have read and accept the",
    termsRequired: "Please accept the terms before ordering.",
    error: "Unable to create the order.",
    loading: "Preparing...",
    continue: "Browse the collection",
  },
  ko: {
    cart: "장바구니",
    empty: "장바구니가 비어 있습니다.",
    subtotal: "소계",
    shipping: "배송",
    free: "무료",
    checkout: "결제 의무가 있는 주문",
    details: "연락처 및 배송",
    name: "성명",
    email: "이메일",
    phone: "전화번호",
    address1: "주소",
    address2: "상세 주소",
    postal: "우편번호",
    city: "도시",
    country: "국가",
    note: "주문 메모",
    required: "배송 정보를 입력해 주세요.",
    terms: "다음을 읽고 동의합니다:",
    termsRequired: "주문 전에 이용약관에 동의해 주세요.",
    error: "주문을 생성할 수 없습니다.",
    loading: "준비 중...",
    continue: "컬렉션 보기",
  },
};

const initialCheckout = {
  customerName: "",
  customerEmail: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  city: "",
  country: "France",
  note: "",
  company: "",
  termsAccepted: false,
};

export function useShopCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useShopCart must be used inside ShopCartProvider");
  return context;
}

export default function ShopCartProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const labels = copy[locale as keyof typeof copy] ?? copy.fr;
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState(initialCheckout);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as CartItem[];
      if (Array.isArray(stored)) setItems(stored.filter((item) => item.productId && item.quantity > 0).slice(0, 40));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (pathname.includes("/shop/confirmation")) setItems([]);
  }, [pathname]);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = `${item.productId}::${item.size || ""}::${item.color || ""}`;
    setItems((current) => {
      const existing = current.find((entry) => entry.key === key);
      if (!existing) return [...current, { ...item, key, quantity: Math.max(1, item.quantity) }];
      return current.map((entry) =>
        entry.key === key ? { ...entry, quantity: Math.min(10, entry.quantity + item.quantity) } : entry,
      );
    });
    setOpen(true);
  }, []);

  const updateQuantity = (key: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, quantity: Math.min(10, quantity) } : item)),
    );
  };

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.priceCents * item.quantity, 0),
    [items],
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const currency = items[0]?.currency || "EUR";
  const isShop = pathname.includes("/shop");

  const checkout = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.addressLine1 || !form.postalCode || !form.city || !form.country) {
      setError(labels.required);
      return;
    }
    if (!form.termsAccepted) {
      setError(labels.termsRequired);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale,
          items: items.map(({ productId, quantity, size, color }) => ({ productId, quantity, size, color })),
        }),
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || labels.error);
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : labels.error);
      setSubmitting(false);
    }
  };

  return (
    <CartContext.Provider value={{ items, addItem, openCart: () => setOpen(true) }}>
      {children}

      {isShop && ready ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-40 right-4 z-[58] flex h-14 items-center gap-2 rounded-full border border-[#ef6aa4]/35 bg-[#171116]/90 px-5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_50px_rgba(0,0,0,.28)] backdrop-blur-xl md:bottom-8 md:right-8"
          aria-label={`${labels.cart}, ${itemCount}`}
        >
          <ShoppingBag size={18} />
          <span>{labels.cart}</span>
          {itemCount > 0 ? <span className="rounded-full bg-[#ef6aa4] px-2 py-0.5 text-[10px]">{itemCount}</span> : null}
        </button>
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setOpen(false);
            }}
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={labels.cart}
              className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[30px] border border-white/10 bg-[#100c0f]/98 p-5 text-white shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(460px,100vw)] sm:rounded-none sm:p-7"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ff8dba]">Sherrie Shop</p>
                  <h2 className="mt-1 text-2xl font-black uppercase">{labels.cart}</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2.5 text-white/70" aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>

              {!items.length ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="mx-auto text-white/25" size={34} />
                  <p className="mt-4 text-sm text-white/55">{labels.empty}</p>
                  <button type="button" onClick={() => setOpen(false)} className="mt-6 rounded-full border border-[#ff8dba]/40 px-5 py-3 text-xs font-black uppercase tracking-wider text-[#ff8dba]">
                    {labels.continue}
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <article key={item.key} className="grid grid-cols-[64px_1fr_auto] gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3">
                        <div className="relative h-16 overflow-hidden rounded-xl bg-white/5">
                          {item.image ? <Image src={item.image} alt="" fill sizes="64px" className="object-cover" /> : <div className="flex h-full items-center justify-center"><ShoppingBag size={20} className="text-white/20" /></div>}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold">{item.name}</h3>
                          <p className="mt-1 text-[11px] text-white/45">{[item.size, item.color].filter(Boolean).join(" · ") || "Standard"}</p>
                          <p className="mt-2 text-sm font-black text-[#ff8dba]">{formatPrice(item.priceCents, item.currency, locale)}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button type="button" onClick={() => updateQuantity(item.key, 0)} className="p-1 text-white/35 hover:text-red-300" aria-label="Supprimer"><Trash2 size={15} /></button>
                          <div className="flex items-center rounded-full border border-white/10">
                            <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} className="p-1.5" aria-label="Moins"><Minus size={12} /></button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} className="p-1.5" aria-label="Plus"><Plus size={12} /></button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="my-6 space-y-2 border-y border-white/10 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-white/50">{labels.subtotal}</span>
                      <strong className="text-xl text-[#ff8dba]">{formatPrice(subtotal, currency, locale)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-white/45">{labels.shipping}</span>
                      <strong className="text-emerald-300">{labels.free}</strong>
                    </div>
                  </div>

                  <form onSubmit={checkout} className="space-y-3">
                    <label className="sr-only" aria-hidden="true">Société<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} /></label>
                    <h3 className="mb-3 text-sm font-black uppercase tracking-wider">{labels.details}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input required className="form-input" placeholder={labels.name} value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} />
                      <input required type="email" className="form-input" placeholder={labels.email} value={form.customerEmail} onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))} />
                    </div>
                    <input className="form-input" placeholder={labels.phone} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
                    <input required className="form-input" placeholder={labels.address1} value={form.addressLine1} onChange={(event) => setForm((current) => ({ ...current, addressLine1: event.target.value }))} />
                    <input className="form-input" placeholder={labels.address2} value={form.addressLine2} onChange={(event) => setForm((current) => ({ ...current, addressLine2: event.target.value }))} />
                    <div className="grid grid-cols-[.75fr_1.25fr] gap-3">
                      <input required className="form-input" placeholder={labels.postal} value={form.postalCode} onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value }))} />
                      <input required className="form-input" placeholder={labels.city} value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
                    </div>
                    <input required className="form-input" placeholder={labels.country} value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} />
                    <textarea className="form-input min-h-20 resize-none" placeholder={labels.note} value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} />
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-xs leading-5 text-white/62">
                      <input required type="checkbox" checked={form.termsAccepted} onChange={(event) => setForm((current) => ({ ...current, termsAccepted: event.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0 accent-[#ef6aa4]" />
                      <span>{labels.terms} <Link href={`/${locale}/cgv`} className="font-bold text-[#ff8dba] underline underline-offset-2">CGV</Link>.</span>
                    </label>
                    {error ? <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
                    <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ef6aa4] px-5 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#ff7caf] disabled:opacity-55">
                      {submitting ? labels.loading : <><Check size={17} /> {labels.checkout}</>}
                    </button>
                  </form>
                </>
              )}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </CartContext.Provider>
  );
}
