"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, ChevronRight, FileText, Loader2, Plus, Receipt, Save, Search, Trash2, X } from "lucide-react";
import InvoiceModal from "@/components/admin/InvoiceModal";
import InvoicesListModal from "@/components/admin/InvoicesListModal";

type Kind = "proposal" | "campaign" | "booking";
type Item = Record<string, any>;

const configs = {
  proposal: {
    title: "Opportunités sponsors",
    api: "proposals",
    statuses: ["PENDING", "REVIEWING", "CONTACTED", "NEGOTIATING", "VALIDATED", "ACTIVE", "COMPLETED", "REJECTED", "ARCHIVED"],
  },
  campaign: {
    title: "Campagnes",
    api: "campaigns",
    statuses: ["DRAFT", "PLANNED", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"],
  },
  booking: {
    title: "Bookings privés",
    api: "bookings",
    statuses: ["NEW", "QUALIFYING", "CONTACTED", "OPTION", "NEGOTIATING", "CONFIRMED", "DEPOSIT_PAID", "COMPLETED", "CANCELLED", "LOST"],
  },
} as const;

const statusLabels: Record<string, string> = {
  PENDING: "Nouveau", REVIEWING: "À examiner", CONTACTED: "Contacté", NEGOTIATING: "Négociation",
  VALIDATED: "Validé", ACTIVE: "Actif", COMPLETED: "Terminé", REJECTED: "Refusé", ARCHIVED: "Archivé",
  DRAFT: "Brouillon", PLANNED: "Planifiée", PAUSED: "En pause", CANCELLED: "Annulée",
  NEW: "Nouveau", QUALIFYING: "Qualification", OPTION: "Option", CONFIRMED: "Confirmé",
  DEPOSIT_PAID: "Acompte payé", LOST: "Perdu",
};

const empty: Record<Kind, Item> = {
  proposal: { brandName: "", contactName: "", contactEmail: "", phone: "", website: "", source: "", campaignType: "", description: "", budget: "", expectedAmount: "", paidAmount: "", currency: "EUR", status: "PENDING", priority: "NORMAL", assignedTo: "", nextAction: "", nextActionAt: "", lastContactAt: "", startDate: "", endDate: "", deliverables: "", requiredAssets: "", pressKitUrl: "", boardUrl: "", contractUrl: "", invoiceUrl: "", promoCode: "", adminNote: "" },
  campaign: { name: "", brandName: "", contactName: "", contactEmail: "", phone: "", status: "DRAFT", priority: "NORMAL", budget: "", paidAmount: "", currency: "EUR", startDate: "", endDate: "", nextAction: "", nextActionAt: "", deliverables: "", requiredAssets: "", pressKitUrl: "", boardUrl: "", contractUrl: "", invoiceUrl: "", promoCode: "", notes: "" },
  booking: { title: "", artistName: "Paga", eventType: "", venue: "", city: "", country: "", eventDate: "", contactName: "", company: "", contactEmail: "", phone: "", status: "NEW", priority: "NORMAL", budget: "", fee: "", deposit: "", currency: "EUR", source: "", nextAction: "", nextActionAt: "", lastContactAt: "", requirements: "", requiredAssets: "", pressKitUrl: "", contractUrl: "", invoiceUrl: "", notes: "" },
};

const fieldLabels: Record<string, string> = {
  brandName: "Marque", name: "Nom de campagne", title: "Nom / événement", contactName: "Contact", contactEmail: "Email",
  phone: "Téléphone", website: "Site web", source: "Source", campaignType: "Type de campagne", description: "Description",
  budget: "Budget", expectedAmount: "Montant estimé", paidAmount: "Montant payé", fee: "Cachet", deposit: "Acompte",
  assignedTo: "Responsable", nextAction: "Prochaine action", nextActionAt: "Échéance", lastContactAt: "Dernier contact",
  startDate: "Début", endDate: "Fin", deliverables: "Livrables", requiredAssets: "Éléments nécessaires",
  pressKitUrl: "Press kit", boardUrl: "Board / dossier", contractUrl: "Contrat", invoiceUrl: "Facture (lien externe)", promoCode: "Code promo",
  adminNote: "Notes internes", notes: "Notes internes", artistName: "Artiste", eventType: "Type d'événement",
  venue: "Lieu", city: "Ville", country: "Pays", eventDate: "Date de l'événement", company: "Société",
  requirements: "Besoins techniques / organisation",
};

function inputType(key: string) {
  if (key.endsWith("At") || key === "eventDate") return "datetime-local";
  if (key === "startDate" || key === "endDate") return "date";
  if (["expectedAmount", "paidAmount", "fee", "deposit"].includes(key)) return "number";
  if (key.includes("Email")) return "email";
  if (key.endsWith("Url") || key === "website") return "url";
  return "text";
}

function getClientInfo(kind: Kind, item: Item) {
  const email = item.contactEmail || "";
  const name = item.brandName || item.name || item.title || item.company || "";
  const phone = item.phone || "";
  return { email, name, phone };
}

export default function PartenariatsClient() {
  const [kind, setKind] = useState<Kind>("proposal");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean; item: Item | null }>({ open: false, item: null });
  const [listModal, setListModal] = useState<{ open: boolean; item: Item | null }>({ open: false, item: null });

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/crm?type=" + configs[kind].api, { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger le Business Board.");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Erreur de chargement." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [kind]);

  const filtered = useMemo(() => items.filter((item) => {
    const text = JSON.stringify(item).toLowerCase();
    return (status === "ALL" || item.status === status) && text.includes(query.toLowerCase());
  }), [items, query, status]);

  const save = async () => {
    if (!editing || saving) return;
    const isNew = !editing.id;
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch(isNew ? "/api/admin/crm" : "/api/admin/crm/" + editing.id, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, type: kind }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "La modification n'a pas pu être enregistrée.");
      }
      setItems((current) => isNew
        ? [result, ...current]
        : current.map((item) => item.id === result.id ? { ...item, ...result } : item)
      );
      setEditing(null);
      setFeedback({ type: "success", message: "Modification enregistrée et Business Board actualisé." });
      await load();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Erreur d'enregistrement." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Item) => {
    if (!confirm("Supprimer définitivement cet élément ?")) return;
    await fetch("/api/admin/crm/" + item.id + "?type=" + kind, { method: "DELETE" });
    load();
  };

  const config = configs[kind];
  const fields = Object.keys(empty[kind]).filter((key) => !["status", "priority", "currency"].includes(key));

  return (
    <div className="min-h-screen px-4 pb-28 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">CRM Paga Production</p>
            <h1 className="text-3xl font-black uppercase sm:text-4xl">Business board</h1>
            <p className="mt-2 text-sm text-white/45">Sponsors, campagnes, bookings, budgets, contacts et documents.</p>
          </div>
          <button onClick={() => setEditing({ ...empty[kind] })} className="btn-primary justify-center"><Plus size={16} /> Ajouter</button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {(Object.keys(configs) as Kind[]).map((key) => (
            <button key={key} onClick={() => { setKind(key); setStatus("ALL"); }} className={"whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold " + (kind === key ? "bg-cyan-300 text-black" : "bg-white/[0.05] text-white/55")}>
              {configs[key].title}
            </button>
          ))}
          <a href="../admin/candidatures" className="whitespace-nowrap rounded-xl bg-white/[0.05] px-4 py-2 text-sm font-bold text-white/55">Candidatures artistes</a>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="relative"><Search className="absolute left-3 top-3.5 text-white/30" size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} className="form-input pl-10" placeholder="Rechercher marque, contact, ville, note..." /></label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input min-w-48">
            <option value="ALL">Tous les statuts</option>
            {config.statuses.map((value) => <option key={value} value={value}>{statusLabels[value] || value}</option>)}
          </select>
        </div>

        {feedback && (
          <div className={"mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm " + (
            feedback.type === "success"
              ? "border-green-400/20 bg-green-400/10 text-green-200"
              : "border-red-400/20 bg-red-400/10 text-red-200"
          )}>
            {feedback.type === "success" ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="ml-auto text-current/60 hover:text-current"><X size={15} /></button>
          </div>
        )}

        <div className="grid gap-3">
          {loading ? <div className="py-20 text-center text-white/40">Chargement...</div> : filtered.map((item) => {
            const client = getClientInfo(kind, item);
            return (
              <article key={item.id} className="glass-card grid gap-4 p-5 lg:grid-cols-[1.4fr_.7fr_.7fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-bold">{item.brandName || item.name || item.title}</h2>
                    <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-[10px] font-black uppercase text-cyan-200">{statusLabels[item.status] || item.status}</span>
                    {item.priority && item.priority !== "NORMAL" && <span className="rounded-full bg-orange-400/10 px-2.5 py-1 text-[10px] font-bold text-orange-300">{item.priority}</span>}
                  </div>
                  <p className="mt-1 truncate text-sm text-white/45">{item.contactName || item.company || "Contact à compléter"} · {item.contactEmail || item.city || "Coordonnées à compléter"}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-white/65">{item.description || item.notes || item.requirements || "Aucun détail"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Budget</p>
                  <p className="mt-1 font-bold">{item.expectedAmount || item.budget || item.fee || "À définir"} {typeof (item.expectedAmount || item.budget || item.fee) === "number" ? item.currency : ""}</p>
                  {item.paidAmount || item.deposit ? <p className="text-xs text-green-400">Payé : {item.paidAmount || item.deposit} {item.currency}</p> : null}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Prochaine action</p>
                  <p className="mt-1 text-sm font-medium">{item.nextAction || "À planifier"}</p>
                  <p className="text-xs text-white/35">{item.nextActionAt ? new Date(item.nextActionAt).toLocaleString("fr-FR") : "Sans échéance"}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing({ ...item })} className="btn-secondary p-3" title="Modifier"><ChevronRight size={16} /></button>
                    <button onClick={() => remove(item)} className="rounded-xl border border-red-400/15 p-3 text-red-300 hover:bg-red-400/10" title="Supprimer"><Trash2 size={16} /></button>
                  </div>
                  {client.email && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setInvoiceModal({ open: true, item })}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/30 px-3 py-2 text-xs text-primary transition-colors hover:bg-primary/10"
                        title="Créer une facture"
                      >
                        <FileText size={12} />
                        Facture
                      </button>
                      <button
                        onClick={() => setListModal({ open: true, item })}
                        className="rounded-xl border border-white/10 p-2 text-white/40 transition-colors hover:bg-white/10"
                        title="Voir toutes les factures"
                      >
                        <Receipt size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/75 p-3 backdrop-blur-lg sm:p-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-cyan-200/15 bg-[#070b13] p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{config.title}</p><h2 className="text-2xl font-black">{editing.id ? "Modifier" : "Créer"}</h2></div>
              <button onClick={() => setEditing(null)} className="btn-secondary p-2"><X size={18} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="mb-1 block text-xs text-white/50">Statut</span><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="form-input">{config.statuses.map((v) => <option key={v} value={v}>{statusLabels[v] || v}</option>)}</select></label>
              <label><span className="mb-1 block text-xs text-white/50">Priorité</span><select value={editing.priority || "NORMAL"} onChange={(e) => setEditing({ ...editing, priority: e.target.value })} className="form-input">{["LOW", "NORMAL", "HIGH", "URGENT"].map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
              {fields.map((key) => {
                const multiline = ["description", "deliverables", "requiredAssets", "adminNote", "notes", "requirements"].includes(key);
                return <label key={key} className={multiline ? "sm:col-span-2" : ""}><span className="mb-1 block text-xs text-white/50">{fieldLabels[key] || key}</span>{multiline ? <textarea rows={4} value={editing[key] || ""} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className="form-input resize-y" /> : <input type={inputType(key)} value={editing[key] ? String(editing[key]).slice(0, inputType(key) === "datetime-local" ? 16 : 10_000) : ""} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className="form-input" />}</label>;
              })}
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} disabled={saving} className="btn-secondary disabled:opacity-40">Annuler</button>
              <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice modals */}
      {invoiceModal.item && (
        <>
          <InvoiceModal
            isOpen={invoiceModal.open}
            onClose={() => setInvoiceModal({ open: false, item: null })}
            type="SPONSOR"
            clientName={getClientInfo(kind, invoiceModal.item).name}
            clientEmail={getClientInfo(kind, invoiceModal.item).email}
            clientPhone={getClientInfo(kind, invoiceModal.item).phone}
            sponsorId={invoiceModal.item.id}
          />
          <InvoicesListModal
            isOpen={listModal.open}
            onClose={() => setListModal({ open: false, item: null })}
            clientEmail={getClientInfo(kind, listModal.item ?? invoiceModal.item).email}
            clientName={getClientInfo(kind, listModal.item ?? invoiceModal.item).name}
          />
        </>
      )}
    </div>
  );
}
