import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales applicables aux commandes passées sur la boutique officielle Sherrie Sherrie.",
};

export default function CGVPage() {
  return (
    <div className="sherrie-page min-h-screen px-4 pb-40 pt-28">
      <article className="mx-auto max-w-3xl">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#c85586]">Sherrie Sherrie</p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] sm:text-4xl">
          Conditions générales de vente
        </h1>
        <p className="mb-8 mt-3 text-sm opacity-50">Dernière mise à jour : 10 août 2026</p>

        <aside className="mb-10 rounded-2xl border border-amber-500/35 bg-amber-400/10 p-5 text-sm leading-6">
          <strong className="block text-amber-700 dark:text-amber-300">Mise en conformité requise avant l’ouverture des paiements</strong>
          L’identité juridique complète du vendeur, son adresse, son numéro d’immatriculation, son capital social, son téléphone,
          son adresse e-mail et les coordonnées du médiateur de la consommation doivent être complétés dans les mentions légales.
          Les paiements en ligne doivent rester désactivés tant que ces informations ne sont pas validées.
        </aside>

        <div className="space-y-9 text-sm leading-7 opacity-80 sm:text-base">
          <Section title="1. Objet et vendeur">
            Les présentes conditions encadrent les ventes de vêtements, couvre-chefs et accessoires proposés sur la boutique
            officielle Sherrie Sherrie. L’identité juridique et les coordonnées opposables du vendeur figurent sur la page{" "}
            <Link href="/fr/mentions-legales" className="font-bold text-[#a75177] underline underline-offset-4">Mentions légales</Link>.
          </Section>

          <Section title="2. Produits">
            Les caractéristiques essentielles, matières, tailles, couleurs, conseils d’entretien et photographies disponibles sont
            présentés sur chaque fiche. Les couleurs peuvent varier légèrement selon l’écran. Le client doit vérifier la fiche, la
            taille et la personnalisation choisies avant de commander.
          </Section>

          <Section title="3. Prix et frais">
            Les prix sont affichés en euros, toutes taxes comprises lorsque la TVA est applicable. Les éventuels frais de livraison
            sont indiqués avant la validation définitive. Le vendeur peut modifier ses prix à tout moment, sans effet rétroactif sur
            une commande déjà confirmée.
          </Section>

          <Section title="4. Commande">
            Le client sélectionne les produits et variantes, vérifie son panier, renseigne ses coordonnées et son adresse, puis
            confirme après avoir pu corriger les erreurs. Le bouton final indique explicitement que la validation implique une
            obligation de paiement. Un accusé de réception récapitulant la commande est adressé au client sur un support durable.
          </Section>

          <Section title="5. Disponibilité">
            Les produits sont proposés dans la limite des stocks disponibles. En cas d’indisponibilité après commande, le client est
            informé rapidement et remboursé des sommes concernées. Le suivi de stock affiché ne constitue pas une réservation avant
            confirmation de la commande.
          </Section>

          <Section title="6. Paiement et sécurité">
            Lorsqu’il est activé, le paiement par carte est traité par Stripe sur une page sécurisée. Le site ne conserve pas les
            numéros complets de carte. La commande n’est payée qu’après confirmation du prestataire. En cas de refus, elle n’est pas
            exécutée. Tant que le paiement en ligne n’est pas activé, une demande enregistrée ne vaut pas encaissement : l’équipe
            contacte le client avant tout paiement.
          </Section>

          <Section title="7. Livraison">
            La zone, le mode, le coût et la date ou le délai de livraison sont communiqués avant la commande. À défaut d’indication
            spécifique, la livraison intervient au plus tard trente jours après la conclusion du contrat. Le risque est transféré au
            client lorsqu’il prend physiquement possession du bien. Tout colis endommagé ou incomplet doit être signalé sans délai,
            sans priver le client de ses garanties légales.
          </Section>

          <Section title="8. Droit de rétractation">
            Le consommateur dispose de quatorze jours à compter de la réception du bien pour notifier sa rétractation, sans avoir à
            justifier sa décision. Il retourne ensuite le produit dans les quatorze jours. Les frais directs de retour restent à sa
            charge s’il en a été informé avant la commande. Le produit doit uniquement avoir été manipulé comme nécessaire pour en
            vérifier la nature, les caractéristiques et le bon fonctionnement.
          </Section>

          <Section title="9. Exceptions au droit de rétractation">
            Le droit de rétractation ne s’applique notamment pas aux articles confectionnés selon les spécifications du client ou
            nettement personnalisés, ni aux biens descellés qui ne peuvent être renvoyés pour des raisons d’hygiène ou de protection
            de la santé lorsque l’exception légale est applicable et clairement signalée avant l’achat.
          </Section>

          <Section title="10. Remboursement après rétractation">
            Le vendeur rembourse les sommes reçues, y compris les frais de livraison standard, au plus tard quatorze jours après la
            notification. Il peut différer le remboursement jusqu’à récupération du bien ou réception d’une preuve d’expédition. Le
            remboursement utilise le même moyen de paiement, sauf accord exprès du client et sans frais supplémentaires.
          </Section>

          <Section title="11. Formulaire type de rétractation">
            Pour exercer ce droit, le client peut envoyer via la page Contact une déclaration dénuée d’ambiguïté comportant : « Je
            vous notifie ma rétractation du contrat portant sur [produit], commandé le [date] et reçu le [date], numéro de commande
            [numéro], nom, adresse, date ». Une confirmation de réception est ensuite adressée au client.
          </Section>

          <Section title="12. Garanties légales">
            Le vendeur répond des défauts de conformité apparaissant dans les deux ans suivant la délivrance, selon les conditions du
            Code de la consommation. Le client bénéficie également de la garantie des vices cachés prévue par le Code civil. Ces
            garanties s’appliquent indépendamment de toute garantie commerciale éventuelle et ne peuvent être écartées par les
            présentes conditions.
          </Section>

          <Section title="13. Réclamations, retours et service client">
            Pour une livraison, un retour, un défaut ou une erreur de commande, le client contacte l’équipe via le formulaire du site
            en indiquant le numéro de commande et, si utile, des photographies. Les instructions et l’adresse de retour lui sont alors
            communiquées. Aucun retour ne doit être envoyé à une adresse non confirmée.
          </Section>

          <Section title="14. Responsabilité et force majeure">
            Le vendeur reste responsable de la bonne exécution de ses obligations légales. Il ne répond pas des dommages résultant
            exclusivement d’un usage anormal du produit, d’une faute du client ou d’un cas de force majeure reconnu par le droit
            français. Aucune clause des présentes CGV ne limite les droits impératifs du consommateur.
          </Section>

          <Section title="15. Données personnelles et preuve">
            Les données de commande sont utilisées pour conclure et exécuter la vente, livrer, gérer les retours, prévenir la fraude et
            respecter les obligations comptables. Les détails figurent dans la{" "}
            <Link href="/fr/politique-confidentialite" className="font-bold text-[#a75177] underline underline-offset-4">Politique de confidentialité</Link>.
            Les enregistrements électroniques et confirmations constituent des éléments de preuve, sous réserve de la preuve contraire.
          </Section>

          <Section title="16. Médiation, droit applicable et litiges">
            Après une réclamation écrite restée sans solution, le consommateur peut saisir gratuitement le médiateur de la consommation
            dont les coordonnées doivent figurer dans les mentions légales. Les présentes conditions sont soumises au droit français,
            sans priver un consommateur résidant dans un autre pays européen des protections impératives de son pays. Les tribunaux
            compétents sont déterminés par les règles légales applicables ; aucune compétence exclusive abusive n’est imposée.
          </Section>

          <Section title="17. Événements, sponsoring et collaborations">
            Les demandes de booking, partenariat ou sponsoring envoyées depuis le site sont des prises de contact. Elles ne deviennent
            contractuelles qu’après acceptation écrite des conditions particulières par les parties. Les conditions propres aux billets
            ou événements sont communiquées séparément avant tout achat concerné.
          </Section>
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-black uppercase tracking-[-0.01em] opacity-100 sm:text-xl">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
