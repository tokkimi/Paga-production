import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Informations sur la protection des données personnelles traitées par le site Sherrie Sherrie.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="sherrie-page min-h-screen px-4 pb-40 pt-28">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black uppercase tracking-[-0.03em] sm:text-4xl">Politique de confidentialité</h1>
        <p className="mb-10 mt-3 text-sm opacity-50">Dernière mise à jour : 10 août 2026</p>

        <div className="space-y-9 text-sm leading-7 opacity-80 sm:text-base">
          <PrivacySection title="1. Responsable du traitement">
            Le responsable est l’entité exploitant la marque Sherrie Sherrie. Son identité juridique et ses coordonnées complètes
            doivent être renseignées dans les mentions légales avant l’ouverture commerciale du shop.
          </PrivacySection>

          <PrivacySection title="2. Données traitées">
            Selon l’usage du site : identité et coordonnées, adresse de livraison, détails et historique de commande, choix de produits,
            messages, dossiers PDF transmis pour un sponsoring, données de compte administrateur, journaux techniques, adresse IP et
            préférences de cookies. Si Stripe est activé, le site reçoit des références et statuts de paiement, mais pas le numéro
            complet de carte.
          </PrivacySection>

          <PrivacySection title="3. Finalités et bases juridiques">
            Les données servent à répondre aux demandes, gérer les candidatures et partenariats, conclure et exécuter les commandes,
            livrer, gérer les retours, assurer la comptabilité, prévenir les abus et sécuriser le site. Ces traitements reposent selon
            le cas sur l’exécution d’un contrat ou de mesures précontractuelles, une obligation légale, l’intérêt légitime de sécurité,
            ou le consentement lorsqu’il est requis.
          </PrivacySection>

          <PrivacySection title="4. Destinataires et prestataires">
            L’accès est limité aux personnes habilitées et aux prestataires nécessaires : hébergement et base de données sur Vercel et
            Neon, stockage des images produits sur Vercel Blob, prestataire de paiement Stripe uniquement s’il est activé, transporteur
            choisi et services techniques indispensables. Les prestataires n’accèdent qu’aux données nécessaires à leur mission.
          </PrivacySection>

          <PrivacySection title="5. Transferts hors de l’Espace économique européen">
            Certains prestataires internationaux peuvent traiter des données hors de l’EEE. Le responsable doit vérifier et documenter
            les garanties applicables, notamment décisions d’adéquation et clauses contractuelles types, dans ses contrats fournisseurs.
          </PrivacySection>

          <PrivacySection title="6. Durées de conservation">
            Les demandes sans suite sont supprimées ou archivées à l’issue d’une durée proportionnée, en principe trois ans après le
            dernier échange. Les données de commande sont conservées pendant l’exécution, la gestion des garanties et les délais de
            prescription applicables. Les pièces comptables et factures sont conservées dix ans lorsque la loi l’impose. Les PDF de
            sponsoring non retenus doivent être supprimés dès que leur conservation n’est plus justifiée. Les journaux de sécurité sont
            conservés pour une durée courte et adaptée au risque.
          </PrivacySection>

          <PrivacySection title="7. Sécurité">
            Des contrôles d’accès réservés aux administrateurs, des mots de passe hachés, le chiffrement HTTPS, des en-têtes de sécurité,
            des validations de fichiers et de données, ainsi que des mises à jour régulières réduisent les risques. Aucun système n’étant
            infaillible, tout incident est analysé et, lorsque la réglementation l’exige, notifié aux personnes concernées et à la CNIL.
          </PrivacySection>

          <PrivacySection title="8. Vos droits">
            Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, la portabilité ou vous opposer à certains
            traitements. Vous pouvez retirer un consentement à tout moment, sans remettre en cause les traitements antérieurs. Une preuve
            d’identité peut être demandée uniquement en cas de doute raisonnable. Les demandes sont adressées via le formulaire de contact.
          </PrivacySection>

          <PrivacySection title="9. Réclamation">
            En l’absence de réponse satisfaisante, vous pouvez saisir la CNIL sur cnil.fr. Vous pouvez également contacter directement le
            responsable du traitement afin de rechercher une solution.
          </PrivacySection>

          <PrivacySection title="10. Mise à jour">
            Cette politique peut évoluer avec les services et les obligations applicables. La date de mise à jour est indiquée en haut
            de page. Toute modification importante est portée à la connaissance des personnes concernées lorsque cela est nécessaire.
          </PrivacySection>
        </div>
      </article>
    </div>
  );
}

function PrivacySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="mb-2 text-xl font-black uppercase">{title}</h2><p>{children}</p></section>;
}
