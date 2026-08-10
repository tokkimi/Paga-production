import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <div className="sherrie-page min-h-screen px-4 pb-40 pt-28">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black uppercase tracking-[-0.03em] sm:text-4xl">Mentions légales</h1>
        <p className="mb-8 mt-3 text-sm opacity-50">Dernière mise à jour : 10 août 2026</p>

        <aside className="mb-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm leading-6">
          <strong className="block text-red-700 dark:text-red-300">Informations obligatoires à compléter avant l’ouverture commerciale</strong>
          Forme juridique exacte, dénomination sociale, capital social, siège complet, SIREN/SIRET, RCS et ville,
          numéro de TVA le cas échéant, téléphone, e-mail de contact, directeur de publication et médiateur de la consommation.
        </aside>

        <div className="space-y-9 text-sm leading-7 opacity-80 sm:text-base">
          <LegalSection title="Éditeur du site">
            <p><strong>Nom commercial :</strong> Sherrie Sherrie</p>
            <p><strong>Site officiel :</strong> www.sherriesherrie.com</p>
            <p><strong>Forme juridique, société, capital, immatriculation, TVA et siège :</strong> à compléter par l’éditeur.</p>
            <p><strong>Directeur ou directrice de la publication :</strong> à compléter par l’éditeur.</p>
            <p><strong>Contact professionnel :</strong> formulaire disponible sur le site ; téléphone et e-mail à compléter.</p>
          </LegalSection>

          <LegalSection title="Hébergement">
            <p><strong>Hébergeur :</strong> Vercel Inc.</p>
            <p><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
            <p><strong>Site :</strong> vercel.com</p>
          </LegalSection>

          <LegalSection title="Médiation de la consommation">
            <p>
              Les coordonnées du médiateur compétent, son adresse et son site doivent être ajoutés après adhésion effective du vendeur
              à un dispositif de médiation. Une référence ne doit pas être publiée sans contrat ou adhésion valide.
            </p>
          </LegalSection>

          <LegalSection title="Propriété intellectuelle">
            <p>
              Les textes, photographies, vidéos, créations graphiques, logos et musiques du site sont protégés par les droits de
              propriété intellectuelle de leurs titulaires. Toute réutilisation dépassant les exceptions légales nécessite une
              autorisation préalable. Les marques et œuvres de tiers restent la propriété de leurs titulaires respectifs.
            </p>
          </LegalSection>

          <LegalSection title="Données personnelles et cookies">
            <p>
              Les traitements sont détaillés dans la{" "}
              <Link href="/fr/politique-confidentialite" className="font-bold text-[#a75177] underline underline-offset-4">Politique de confidentialité</Link>
              {" "}et les traceurs dans la <Link href="/fr/cookies" className="font-bold text-[#a75177] underline underline-offset-4">Politique cookies</Link>.
            </p>
          </LegalSection>

          <LegalSection title="Conditions de vente et droit applicable">
            <p>
              Les achats sont régis par les <Link href="/fr/cgv" className="font-bold text-[#a75177] underline underline-offset-4">Conditions générales de vente</Link>.
              Le droit français s’applique sous réserve des dispositions impératives protectrices du consommateur. Les juridictions
              compétentes sont celles désignées par la loi.
            </p>
          </LegalSection>
        </div>
      </article>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="mb-2 text-xl font-black uppercase">{title}</h2><div className="space-y-1">{children}</div></section>;
}
