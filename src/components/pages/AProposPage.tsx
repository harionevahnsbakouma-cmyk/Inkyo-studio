import { motion } from 'framer-motion';
import { BookOpen, Users, Vote, Palette, Globe, Zap, Crown, DollarSign } from 'lucide-react';

const FEATURES = [
  { icon: <BookOpen className="w-5 h-5" />, title: 'Liseuse HD', desc: 'Scroll vertical ou tap horizontal, lecture immersive adaptée au mobile et au desktop.', color: 'text-crimson', bg: 'bg-crimson/10' },
  { icon: <Users className="w-5 h-5" />, title: 'Communauté & Pro', desc: 'Basculez entre Inkyo (communautaire) et Eumène (catalogue professionnel).', color: 'text-eumene', bg: 'bg-eumene/10' },
  { icon: <Vote className="w-5 h-5" />, title: 'Vote pour l\'impression', desc: 'Les œuvres les plus votées seront éditées en version papier. Le top est épinglé en accueil.', color: 'text-gold', bg: 'bg-gold/10' },
  { icon: <DollarSign className="w-5 h-5" />, title: 'Monétisation équitable', desc: '20% global + 15% direct aux créateurs. PayPal & MTN Mobile Money.', color: 'text-premium', bg: 'bg-premium/10' },
  { icon: <Zap className="w-5 h-5" />, title: 'Bulk Upload', desc: 'Publiez des séries de plus de 1000 épisodes en un seul import depuis votre appareil.', color: 'text-crimson', bg: 'bg-crimson/10' },
  { icon: <Palette className="w-5 h-5" />, title: 'E-shop & Art-books', desc: 'Print-on-Demand via Eumène : art-books, posters et produits dérivés (bientôt).', color: 'text-eumene', bg: 'bg-eumene/10' },
  { icon: <Globe className="w-5 h-5" />, title: 'Accessibilité Afrique', desc: 'MTN Mobile Money pour une accessibilité maximale sur le continent africain.', color: 'text-gold', bg: 'bg-gold/10' },
  { icon: <Crown className="w-5 h-5" />, title: 'Gamification', desc: 'Badges, classements et récompenses pour les lecteurs et créateurs.', color: 'text-premium', bg: 'bg-premium/10' },
];

export default function AProposPage() {
  return (
    <div className="pt-20 pb-24 md:pb-10">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <img src="/images/inkyo-logo.png" alt="Inkyo" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-black text-ink-white mb-3">À propos d'Inkyo</h1>
          <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
            Inkyo est une plateforme hybride révolutionnaire à la croisée de Netflix, TikTok et Mangadraft.
            Notre mission : donner aux créateurs indépendants de manga et webtoon les outils pour publier,
            monétiser et faire vivre leurs histoires.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-linear-to-br from-crimson/10 via-ink-card to-gold/10 rounded-2xl border border-ink-border/20 mb-10 text-center"
        >
          <h2 className="text-lg font-bold text-ink-white mb-2">Notre mission</h2>
          <p className="text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            Démocratiser la création de webtoons en offrant un accès instantané à la publication,
            un système de vote communautaire pour l'édition papier, et une monétisation équitable
            accessible partout dans le monde — y compris en Afrique via MTN Mobile Money.
          </p>
        </motion.div>

        {/* Features grid */}
        <h2 className="text-lg font-bold text-ink-white mb-4 text-center">Ce qui rend Inkyo unique</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              className="p-4 bg-ink-card rounded-xl border border-ink-border/20 hover:border-ink-border/40 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg ${f.bg} ${f.color} flex items-center justify-center mb-2`}>{f.icon}</div>
              <h3 className="text-sm font-semibold text-ink-white">{f.title}</h3>
              <p className="text-xs text-ink-muted mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
