export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-2">Mentions Légales</h1>
        <p className="text-white/40 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Éditeur du site</h2>
            <div className="space-y-1">
              <p><span className="text-white/50">Société :</span> Paga Production</p>
              <p><span className="text-white/50">Statut :</span> SAS</p>
              <p><span className="text-white/50">Adresse :</span> France</p>
              <p><span className="text-white/50">Contact :</span> formulaire disponible sur le site</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Hébergement</h2>
            <div className="space-y-1">
              <p><span className="text-white/50">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="text-white/50">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</p>
              <p><span className="text-white/50">Site :</span> vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Propriété intellectuelle</h2>
            <p>L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, musiques) est protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable de Paga Production.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Données personnelles</h2>
            <p>Le traitement des données personnelles est régi par notre <a href="/fr/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</a>, conformément au Règlement Général sur la Protection des Données (RGPD).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Cookies</h2>
            <p>Ce site utilise des cookies fonctionnels et analytiques. Consultez notre <a href="/fr/cookies" className="text-primary hover:underline">Politique Cookies</a> pour en savoir plus.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Droit applicable</h2>
            <p>Le présent site est soumis au droit français. Tout litige relatif à son utilisation sera soumis à la compétence exclusive des tribunaux français.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
