export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-2">Politique de Confidentialité</h1>
        <p className="text-white/40 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Responsable du traitement</h2>
            <p>Paga Production est responsable du traitement de vos données personnelles collectées via ce site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone (optionnel)</li>
              <li>Données de navigation (cookies)</li>
              <li>Données de paiement (traitées exclusivement par Stripe)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>La gestion de votre compte utilisateur</li>
              <li>L’envoi de la newsletter (avec votre consentement)</li>
              <li>Le traitement des propositions de partenariat</li>
              <li>L’amélioration de nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Conservation</h2>
            <p>Vos données sont conservées pendant 3 ans à compter de votre dernière interaction avec nos services, sauf obligation légale contraire.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (&laquo; droit à l&apos;oubli &raquo;)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits, utilisez le formulaire de contact disponible sur le site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Sécurité</h2>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Contact CNIL</h2>
            <p>Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
