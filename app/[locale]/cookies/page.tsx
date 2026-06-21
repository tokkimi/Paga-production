export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-2">Politique Cookies</h1>
        <p className="text-white/40 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Qu&apos;est-ce qu&apos;un cookie ?</h2>
            <p>Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur notre site. Il nous permet de vous reconnaître lors de vos prochaines visites et d&apos;améliorer votre expérience.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Cookies utilisés</h2>
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="font-bold text-white mb-1">Cookies essentiels</h3>
                <p className="text-sm">Nécessaires au fonctionnement du site (session, authentification). Ils ne peuvent pas être désactivés.</p>
              </div>
              <div className="glass-card p-4">
                <h3 className="font-bold text-white mb-1">Cookies de préférences</h3>
                <p className="text-sm">Mémorisent vos choix (langue, consentement cookies). Durée : 12 mois.</p>
              </div>
              <div className="glass-card p-4">
                <h3 className="font-bold text-white mb-1">Cookies analytiques</h3>
                <p className="text-sm">Nous aident à comprendre comment vous utilisez notre site (pages visitées, durée). Ces cookies sont anonymisés.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Gérer vos préférences</h2>
            <p>Vous pouvez accepter ou refuser les cookies non essentiels via la bannière qui apparaît lors de votre première visite. Vous pouvez également supprimer les cookies via les paramètres de votre navigateur.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p>Pour toute question : <a href="mailto:contact@paga-production.fr" className="text-primary hover:underline">contact@paga-production.fr</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
