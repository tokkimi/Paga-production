"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit2, ImagePlus, Package, Plus, ShoppingBag, Star, Trash2, Truck, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AUDIENCE_LABELS, CATEGORY_LABELS, PRODUCT_AUDIENCES, PRODUCT_CATEGORIES, colorSwatchValue, formatPrice, getProductColorSettings, normalizeProductSlug, type ProductAudienceValue, type ProductCategoryValue, type ProductColorSetting } from "@/lib/shop";
import type { ShopProduct } from "@/lib/shop-types";

type ShopOrderStatus = "PENDING" | "AWAITING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
type ShopOrder = {
  id: string;
  orderNumber: string;
  status: ShopOrderStatus;
  customerName: string;
  customerEmail: string;
  phone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  city: string;
  country: string;
  note: string | null;
  totalCents: number;
  currency: string;
  createdAt: string;
  items: Array<{ id: string; productName: string; quantity: number; size: string | null; color: string | null; unitPriceCents: number }>;
};

const STATUS_LABELS: Record<ShopOrderStatus, string> = {
  PENDING: "À confirmer",
  AWAITING_PAYMENT: "Paiement en attente",
  PAID: "Payée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const EMPTY_FORM = {
  name: "",
  nameEn: "",
  nameKo: "",
  slug: "",
  description: "",
  descriptionEn: "",
  descriptionKo: "",
  details: "",
  category: "TSHIRT" as ProductCategoryValue,
  collection: "Essentiel",
  audience: "MIXTE" as ProductAudienceValue,
  sourceUrl: "",
  price: "",
  sizes: "",
  colors: "",
  colorSettings: [] as ProductColorSetting[],
  stock: "0",
  trackStock: false,
  isActive: true,
  isFeatured: false,
  order: "0",
};

function fileSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.ceil(bytes / 1024)} Ko`;
}

export default function AdminShopPage() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploadColor, setUploadColor] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/shop-orders", { cache: "no-store" }),
      ]);
      const [productData, orderData] = await Promise.all([productsResponse.json(), ordersResponse.json()]);
      setProducts(Array.isArray(productData) ? productData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFiles([]);
    setUploadColor("");
    setError("");
    setShowForm(true);
  };

  const openEdit = (product: ShopProduct) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      nameEn: product.nameEn || "",
      nameKo: product.nameKo || "",
      slug: product.slug,
      description: product.description || "",
      descriptionEn: product.descriptionEn || "",
      descriptionKo: product.descriptionKo || "",
      details: product.details || "",
      category: product.category,
      collection: product.collection,
      audience: product.audience,
      sourceUrl: product.sourceUrl || "",
      price: (product.priceCents / 100).toFixed(2),
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      colorSettings: getProductColorSettings(product.colors, product.colorSettings),
      stock: String(product.stock),
      trackStock: product.trackStock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      order: String(product.order),
    });
    setFiles([]);
    setUploadColor(product.colors[0] || "");
    setError("");
    setShowForm(true);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const accepted = Array.from(incoming).filter((file) => file.type.startsWith("image/") && file.size <= 4 * 1024 * 1024);
    setFiles((current) => [...current, ...accepted].slice(0, 12));
  };

  const updateColors = (value: string) => {
    const names = [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))].slice(0, 30);
    setForm((current) => ({
      ...current,
      colors: value,
      colorSettings: names.map((name) => current.colorSettings.find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()) || { name, active: true }),
    }));
    if (uploadColor && !names.includes(uploadColor)) setUploadColor("");
  };

  const toggleColor = (name: string) => {
    setForm((current) => ({ ...current, colorSettings: current.colorSettings.map((item) => item.name === name ? { ...item, active: !item.active } : item) }));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setProgress("Enregistrement du produit...");
    try {
      const response = await fetch(editId ? `/api/admin/products/${editId}` : "/api/admin/products", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || normalizeProductSlug(form.name),
          price: Number(form.price.replace(",", ".")),
          stock: Number(form.stock),
          order: Number(form.order),
        }),
      });
      const product = (await response.json()) as ShopProduct & { error?: string };
      if (!response.ok) throw new Error(product.error || "Impossible d'enregistrer le produit.");

      for (let index = 0; index < files.length; index += 1) {
        setProgress(`Envoi de l'image ${index + 1}/${files.length}...`);
        const imageBody = new FormData();
        imageBody.append("file", files[index]);
        if (uploadColor) imageBody.append("color", uploadColor);
        const upload = await fetch(`/api/admin/products/${product.id}/images`, { method: "POST", body: imageBody });
        if (!upload.ok) {
          const uploadError = (await upload.json()) as { error?: string };
          throw new Error(uploadError.error || `L'image ${files[index].name} n'a pas été envoyée.`);
        }
      }

      setShowForm(false);
      setFiles([]);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible d'enregistrer le produit.");
    } finally {
      setSaving(false);
      setProgress("");
    }
  };

  const removeProduct = async (product: ShopProduct) => {
    if (!confirm(`Supprimer définitivement « ${product.name} » et ses images ?`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (!response.ok) return alert("La suppression a échoué.");
    await load();
  };

  const removeImage = async (productId: string, imageId: string) => {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch(`/api/admin/products/${productId}/images/${imageId}`, { method: "DELETE" });
    await load();
  };

  const makeCover = async (productId: string, imageId: string) => {
    await fetch(`/api/admin/products/${productId}/images/${imageId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ makeCover: true }) });
    await load();
  };

  const updateImageColor = async (productId: string, imageId: string, color: string) => {
    const response = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color: color || null }),
    });
    if (!response.ok) return alert("Impossible d'associer la couleur à cette image.");
    await load();
  };

  const updateOrderStatus = async (id: string, status: ShopOrderStatus) => {
    const response = await fetch(`/api/admin/shop-orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-white/45">Chargement de la boutique...</div>;

  return (
    <div className="min-h-screen px-4 pb-32 pt-24 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#ff8dba]">Administration</p>
            <h1 className="mt-2 text-4xl font-black uppercase">Sherrie Shop</h1>
            <p className="mt-2 text-sm text-white/45">Catalogue, visuels, variantes, stock et commandes.</p>
          </div>
          {tab === "products" ? <button type="button" onClick={openCreate} className="btn-primary self-start sm:self-auto"><Plus size={16} /> Ajouter un produit</button> : null}
        </header>

        <aside className="mb-7 rounded-2xl border border-amber-400/25 bg-amber-400/[0.08] p-4 text-xs leading-5 text-amber-100/75">
          <strong className="block text-amber-200">Avant d’activer les paiements</strong>
          Compléter l’identité juridique, le SIRET/RCS, l’adresse, le téléphone, l’e-mail et le médiateur dans les mentions légales,
          puis configurer Stripe et vérifier une commande test. Le catalogue et les demandes de commande peuvent être préparés sans paiement.
        </aside>

        <div className="mb-7 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 sm:max-w-md">
          <button type="button" onClick={() => setTab("products")} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider ${tab === "products" ? "bg-[#ef6aa4] text-white" : "text-white/48"}`}><Package size={15} /> Produits ({products.length})</button>
          <button type="button" onClick={() => setTab("orders")} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider ${tab === "orders" ? "bg-[#ef6aa4] text-white" : "text-white/48"}`}><Truck size={15} /> Commandes ({orders.length})</button>
        </div>

        {tab === "products" ? (
          products.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045]">
                  <div className="relative aspect-[16/10] bg-white/[0.035]">
                    {product.images[0] ? <Image src={product.images[0].url} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full items-center justify-center"><ShoppingBag size={34} className="text-white/18" /></div>}
                    <div className="absolute left-3 top-3 flex gap-2">
                      <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase backdrop-blur-xl ${product.isActive ? "bg-emerald-500/80" : "bg-black/70"}`}>{product.isActive ? "En ligne" : "Masqué"}</span>
                      {product.isFeatured ? <span className="rounded-full bg-[#ef6aa4]/85 px-3 py-1 text-[9px] font-black uppercase backdrop-blur-xl">À la une</span> : null}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#ff8dba]">{product.collection} · {AUDIENCE_LABELS[product.audience].fr} · {CATEGORY_LABELS[product.category].fr}</p>
                    <div className="mt-2 flex justify-between gap-4"><h2 className="font-black uppercase">{product.name}</h2><strong className="text-[#ff8dba]">{formatPrice(product.priceCents, product.currency)}</strong></div>
                    <p className="mt-2 text-xs text-white/40">{product.sizes.length ? product.sizes.join(" · ") : "Taille unique"}{product.colors.length ? ` · ${product.colors.join(" · ")}` : ""}</p>
                    {product.colors.length ? <p className="mt-1 text-[10px] text-white/35">{getProductColorSettings(product.colors, product.colorSettings).filter((item) => item.active).length} couleur(s) active(s) sur {product.colors.length}</p> : null}
                    <p className="mt-1 text-xs text-white/40">{product.trackStock ? `Stock : ${product.stock}` : "Stock non suivi"} · {product.images.length} image(s)</p>

                    {product.images.length ? (
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {product.images.map((image, index) => (
                          <div key={image.id} className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border ${index === 0 ? "border-yellow-300/80" : "border-white/10"}`}>
                            <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
                            <div className="absolute inset-x-1 bottom-1 space-y-1 rounded-lg bg-black/80 p-1 backdrop-blur-md">
                              {product.colors.length ? <select value={image.color || ""} onChange={(event) => updateImageColor(product.id, image.id, event.target.value)} className="w-full rounded-md bg-black/60 px-1 py-1 text-[8px] font-bold text-white" aria-label="Couleur associée à l'image"><option value="">Toutes les couleurs</option>{product.colors.map((color) => <option key={color} value={color}>{color}</option>)}</select> : null}
                              <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => makeCover(product.id, image.id)}
                                className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1 py-1 text-[8px] font-black uppercase ${index === 0 ? "bg-yellow-300 text-black" : "bg-white/10 text-white"}`}
                                aria-label={index === 0 ? "Image principale" : "Définir comme image principale"}
                                title={index === 0 ? "Image principale" : "Définir comme image principale"}
                              >
                                <Star size={10} fill={index === 0 ? "currentColor" : "none"} />
                                {index === 0 ? "Principale" : "Choisir"}
                              </button>
                              <button type="button" onClick={() => removeImage(product.id, image.id)} className="rounded-md bg-red-500/15 p-1.5 text-red-300" title="Supprimer" aria-label="Supprimer l'image"><Trash2 size={11} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex gap-2">
                      <button type="button" onClick={() => openEdit(product)} className="btn-secondary flex-1 justify-center"><Edit2 size={14} /> Modifier</button>
                      <button type="button" onClick={() => removeProduct(product)} className="rounded-xl border border-red-500/30 p-3 text-red-300 hover:bg-red-500/10" aria-label="Supprimer"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/15 px-6 py-20 text-center"><Package className="mx-auto text-white/20" size={38} /><p className="mt-4 text-sm text-white/45">Aucun produit. Ajoute le premier design quand il est prêt.</p></div>
          )
        ) : (
          orders.length ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#ff8dba]">{order.orderNumber}</p>
                      <h2 className="mt-2 text-lg font-black">{order.customerName}</h2>
                      <p className="mt-1 text-xs text-white/45">{order.customerEmail}{order.phone ? ` · ${order.phone}` : ""}</p>
                      <p className="mt-1 text-xs text-white/45">{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""} · {order.postalCode} {order.city} · {order.country}</p>
                    </div>
                    <div className="sm:text-right">
                      <strong className="text-xl text-[#ff8dba]">{formatPrice(order.totalCents, order.currency)}</strong>
                      <p className="mt-1 text-[10px] text-white/35">{new Date(order.createdAt).toLocaleString("fr-FR")}</p>
                      <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as ShopOrderStatus)} className="mt-3 rounded-xl border border-white/12 bg-[#171116] px-3 py-2 text-xs font-bold text-white">
                        {(Object.keys(STATUS_LABELS) as ShopOrderStatus[]).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item) => <div key={item.id} className="rounded-xl bg-white/[0.045] p-3 text-xs"><strong>{item.quantity}× {item.productName}</strong><p className="mt-1 text-white/40">{[item.size, item.color].filter(Boolean).join(" · ") || "Standard"}</p></div>)}
                  </div>
                  {order.note ? <p className="mt-4 rounded-xl border border-white/8 bg-black/10 p-3 text-xs text-white/50">Note : {order.note}</p> : null}
                </article>
              ))}
            </div>
          ) : <div className="rounded-[28px] border border-dashed border-white/15 px-6 py-20 text-center"><Truck className="mx-auto text-white/20" size={38} /><p className="mt-4 text-sm text-white/45">Aucune commande pour le moment.</p></div>
        )}

        <AnimatePresence>
          {showForm ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md sm:p-4">
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="absolute inset-x-0 bottom-0 max-h-[94dvh] overflow-y-auto rounded-t-[30px] border border-white/10 bg-[#100c0f] p-5 sm:relative sm:mx-auto sm:mt-[3vh] sm:max-w-4xl sm:rounded-[30px] sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div><p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#ff8dba]">Catalogue</p><h2 className="mt-1 text-2xl font-black uppercase">{editId ? "Modifier le produit" : "Nouveau produit"}</h2></div>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-white/10 p-2.5 text-white/60"><X size={18} /></button>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-4">
                    <Field label="Nom FR *"><input className="form-input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, slug: editId ? current.slug : normalizeProductSlug(event.target.value) }))} /></Field>
                    <div className="grid gap-3 sm:grid-cols-2"><Field label="Nom EN"><input className="form-input" value={form.nameEn} onChange={(event) => setForm((current) => ({ ...current, nameEn: event.target.value }))} /></Field><Field label="Nom KO"><input className="form-input" value={form.nameKo} onChange={(event) => setForm((current) => ({ ...current, nameKo: event.target.value }))} /></Field></div>
                    <Field label="Adresse URL *"><input className="form-input" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: normalizeProductSlug(event.target.value) }))} /></Field>
                    <div className="grid gap-3 sm:grid-cols-2"><Field label="Collection *"><input className="form-input" value={form.collection} onChange={(event) => setForm((current) => ({ ...current, collection: event.target.value }))} placeholder="Essentiel" /></Field><Field label="Public"><select className="form-input" value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value as ProductAudienceValue }))}>{PRODUCT_AUDIENCES.map((item) => <option key={item} value={item}>{AUDIENCE_LABELS[item].fr}</option>)}</select></Field></div>
                    <Field label="Lien fournisseur (privé, non affiché dans la boutique)"><input type="url" className="form-input" value={form.sourceUrl} onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))} placeholder="https://..." /></Field>
                    <Field label="Description FR"><textarea rows={4} className="form-input resize-none" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></Field>
                    <div className="grid gap-3 sm:grid-cols-2"><Field label="Description EN"><textarea rows={3} className="form-input resize-none" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} /></Field><Field label="Description KO"><textarea rows={3} className="form-input resize-none" value={form.descriptionKo} onChange={(event) => setForm((current) => ({ ...current, descriptionKo: event.target.value }))} /></Field></div>
                    <Field label="Détails, matière, entretien"><textarea rows={4} className="form-input resize-none" value={form.details} onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))} /></Field>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3"><Field label="Catégorie"><select className="form-input" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as ProductCategoryValue }))}>{PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{CATEGORY_LABELS[category].fr}</option>)}</select></Field><Field label="Prix TTC (€) *"><input inputMode="decimal" className="form-input" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="49,00" /></Field></div>
                    <Field label="Tailles, séparées par des virgules"><input className="form-input" value={form.sizes} onChange={(event) => setForm((current) => ({ ...current, sizes: event.target.value }))} placeholder="XS, S, M, L, XL" /></Field>
                    <Field label="Couleurs, séparées par des virgules"><input className="form-input" value={form.colors} onChange={(event) => updateColors(event.target.value)} placeholder="Noir, Blanc, Rose" /></Field>
                    {form.colorSettings.length ? <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"><p className="mb-2 text-[10px] font-black uppercase tracking-wider text-white/45">Couleurs disponibles en ligne</p><div className="flex flex-wrap gap-2">{form.colorSettings.map((item) => <button type="button" key={item.name} onClick={() => toggleColor(item.name)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold transition ${item.active ? "border-[#ff8dba]/45 bg-[#ef6aa4]/15 text-white" : "border-white/10 bg-black/15 text-white/35 line-through"}`} title={item.active ? "Désactiver cette couleur" : "Activer cette couleur"}><span className="h-3 w-3 rounded-full border border-black/20" style={{ background: colorSwatchValue(item.name) }} />{item.name}</button>)}</div><p className="mt-2 text-[10px] text-white/35">Clique une couleur pour l’activer ou la désactiver dans la boutique.</p></div> : null}
                    <div className="grid grid-cols-2 gap-3"><Field label="Stock"><input type="number" min="0" className="form-input" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} /></Field><Field label="Ordre d'affichage"><input type="number" min="0" className="form-input" value={form.order} onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))} /></Field></div>

                    <div
                      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
                      onDragOver={(event) => event.preventDefault()}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
                      className={`rounded-[22px] border-2 border-dashed p-6 text-center transition ${dragging ? "border-[#ff8dba] bg-[#ef6aa4]/10" : "border-white/15 bg-white/[0.025]"}`}
                    >
                      <ImagePlus className="mx-auto text-[#ff8dba]" size={28} />
                      <p className="mt-3 text-sm font-bold">Glisse plusieurs images ici</p>
                      <p className="mt-1 text-[10px] text-white/35">JPG, PNG, WebP ou AVIF · 4 Mo max par image · 12 images max</p>
                      <label className="mt-4 inline-flex cursor-pointer rounded-full border border-[#ff8dba]/35 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#ff8dba]">Choisir des images<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }} /></label>
                    </div>
                    {form.colorSettings.length ? <Field label="Associer les nouvelles images à cette couleur"><select className="form-input" value={uploadColor} onChange={(event) => setUploadColor(event.target.value)}><option value="">Toutes les couleurs / visuel général</option>{form.colorSettings.map((item) => <option key={item.name} value={item.name}>{item.name}{item.active ? "" : " (masquée)"}</option>)}</select></Field> : null}
                    {files.length ? <div className="space-y-2">{files.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs"><span className="min-w-0 truncate">{file.name} <span className="text-white/30">· {fileSize(file.size)}</span></span><button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="ml-3 text-red-300"><X size={14} /></button></div>)}</div> : null}

                    <div className="grid gap-3 sm:grid-cols-3">
                      <Toggle label="Suivre le stock" checked={form.trackStock} onChange={(trackStock) => setForm((current) => ({ ...current, trackStock }))} />
                      <Toggle label="Visible en ligne" checked={form.isActive} onChange={(isActive) => setForm((current) => ({ ...current, isActive }))} />
                      <Toggle label="À la une" checked={form.isFeatured} onChange={(isFeatured) => setForm((current) => ({ ...current, isFeatured }))} />
                    </div>
                  </div>
                </div>

                {error ? <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
                {progress ? <p className="mt-5 text-center text-xs font-bold text-[#ff8dba]">{progress}</p> : null}
                <div className="mt-7 flex gap-3"><button type="button" disabled={saving} onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Annuler</button><button type="button" disabled={saving || !form.name || !form.price} onClick={save} className="btn-primary flex-1 justify-center"><Check size={16} /> {saving ? "Enregistrement..." : "Enregistrer"}</button></div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/45">{label}</span>{children}</label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-3 text-xs font-bold"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[#ef6aa4]" />{label}</label>;
}
