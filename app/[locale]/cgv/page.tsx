export default function CGVPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-2">Conditions Générales de Vente</h1>
        <p className="text-white/40 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Objet</h2>
            <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Paga Production et ses clients dans le cadre de la vente de billets d’événements et de services de partenariat.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Prix et paiement</h2>
            <p>Les prix sont indiqués en euros TTC. Le paiement s’effectue en ligne par carte bancaire via notre prestataire sécurisé Stripe. Toute commande est ferme et définitive dès validation du paiement.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Billets</h2>
            <p>Les billets achetés sont nominatifs et non cessibles. En cas d’annulation de l’événement par l’organisateur, un remboursement intégral sera effectué sous 30 jours. Aucun remboursement ne sera accordé en cas d’absence du participant.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Partenariats</h2>
            <p>Les propositions de partenariat soumises via notre plateforme sont examinées sous 48 heures ouvrables. Paga Production se réserve le droit d’accepter ou de refuser toute proposition sans obligation de motivation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Responsabilité</h2>
            <p>Paga Production ne saurait être tenu responsable des dommages indirects liés à l’utilisation de ses services. La responsabilité de Paga Production est limitée au montant payé par le client.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Droit applicable</h2>
            <p>Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Paris.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Contact</h2>
            <p>Pour toute question : <a href="mailto:contact@paga-production.fr" className="text-primary hover:underline">contact@paga-production.fr</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
