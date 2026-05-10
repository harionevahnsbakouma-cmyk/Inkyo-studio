import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Upload, Vote, CreditCard, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

const FAQ = [
  {
    cat: 'Lecture',
    icon: <BookOpen className="w-4 h-4" />,
    questions: [
      { q: 'Comment lire un webtoon ?', a: 'Cliquez sur la couverture d\'un webtoon ou sur le bouton "Lire" pour ouvrir la liseuse. Vous pouvez choisir entre le mode scroll vertical et le mode tap horizontal.' },
      { q: 'Puis-je lire hors connexion ?', a: 'La lecture hors connexion sera disponible dans une prochaine mise à jour. Pour l\'instant, une connexion internet est nécessaire.' },
      { q: 'Comment changer le mode de lecture ?', a: 'Dans la liseuse, cliquez sur l\'icône en haut à droite pour basculer entre scroll vertical et tap horizontal.' },
    ]
  },
  {
    cat: 'Publication',
    icon: <Upload className="w-4 h-4" />,
    questions: [
      { q: 'Comment publier mon webtoon ?', a: 'Cliquez sur le bouton "Publier" dans la navbar, remplissez les informations de votre œuvre puis importez vos images depuis votre appareil.' },
      { q: 'Quels formats d\'image sont acceptés ?', a: 'PNG, JPG et WebP sont acceptés. Nous recommandons une largeur de 800px minimum pour une qualité optimale.' },
      { q: 'Comment fonctionne le Bulk Upload ?', a: 'Activez le mode Bulk Upload dans l\'écran de publication pour importer plusieurs épisodes d\'un coup. Idéal pour les séries de plus de 1000 épisodes.' },
    ]
  },
  {
    cat: 'Votes',
    icon: <Vote className="w-4 h-4" />,
    questions: [
      { q: 'Comment voter pour un webtoon ?', a: 'Rendez-vous sur la page Votes dans la navbar et cliquez sur le bouton "Voter" à côté de l\'œuvre de votre choix.' },
      { q: 'À quoi servent les votes ?', a: 'Les webtoons les plus votés seront édités en version papier. Le top 5 sera imprimé en édition collector.' },
      { q: 'Le webtoon épinglé, c\'est quoi ?', a: 'Le webtoon avec le plus de votes est automatiquement épinglé en haut de la page d\'accueil pour être mis en avant.' },
    ]
  },
  {
    cat: 'Premium & Paiement',
    icon: <CreditCard className="w-4 h-4" />,
    questions: [
      { q: 'Quels sont les avantages Premium ?', a: 'Lecture sans publicité, accès anticipé aux nouveaux épisodes, badge VIP exclusif et soutien direct aux créateurs.' },
      { q: 'Quels modes de paiement sont acceptés ?', a: 'PayPal et MTN Mobile Money sont disponibles pour les abonnements et les achats.' },
      { q: 'Comment les créateurs sont-ils rémunérés ?', a: 'Les créateurs reçoivent 20% des revenus globaux + 15% en soutien direct des abonnés Premium.' },
    ]
  },
];

export default function AidePage() {
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? FAQ.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : FAQ;

  return (
    <div className="pt-20 pb-24 md:pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-eumene/15 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-eumene" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink-white">Centre d'aide</h1>
              <p className="text-sm text-ink-muted">Trouvez rapidement des réponses à vos questions</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mt-6 mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une question..."
            className="w-full bg-ink-card border border-ink-border/30 rounded-xl pl-11 pr-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-eumene/50 focus:ring-1 focus:ring-eumene/20 transition-all"
          />
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          {filtered.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.05 }}
            >
              <h2 className="text-sm font-bold text-ink-white flex items-center gap-2 mb-3">
                <span className="text-eumene">{cat.icon}</span> {cat.cat}
              </h2>
              <div className="space-y-2">
                {cat.questions.map((item, qi) => {
                  const key = `${ci}-${qi}`;
                  const isOpen = openIdx === key;
                  return (
                    <div key={qi} className="bg-ink-card rounded-xl border border-ink-border/20 overflow-hidden">
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                      >
                        <span className="text-sm text-ink-text font-medium pr-4">{item.q}</span>
                        <ChevronRight className={`w-4 h-4 text-ink-muted shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="px-4 pb-3"
                        >
                          <p className="text-xs text-ink-muted leading-relaxed">{item.a}</p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <HelpCircle className="w-10 h-10 text-ink-muted mx-auto mb-3" />
            <p className="text-sm text-ink-muted">Aucun résultat pour "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
