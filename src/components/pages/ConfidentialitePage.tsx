import { motion } from 'framer-motion';
import { Shield, Eye, Database, Lock, Trash2, Globe } from 'lucide-react';

const SECTIONS = [
  {
    icon: <Database className="w-4 h-4" />,
    title: 'Données collectées',
    content: 'Nous collectons les informations nécessaires au fonctionnement du service : nom, adresse e-mail, données de connexion (Google, TikTok). Les données de lecture et de vote sont enregistrées pour personnaliser votre expérience. Aucune donnée bancaire n\'est stockée directement sur nos serveurs.'
  },
  {
    icon: <Eye className="w-4 h-4" />,
    title: 'Utilisation des données',
    content: 'Vos données sont utilisées pour : gérer votre compte, personnaliser votre expérience de lecture, calculer les statistiques des créateurs, traiter les paiements et abonnements, et améliorer la plateforme. Nous ne vendons jamais vos données personnelles à des tiers.'
  },
  {
    icon: <Lock className="w-4 h-4" />,
    title: 'Sécurité',
    content: 'Nous utilisons le chiffrement SSL/TLS pour toutes les communications. Les mots de passe sont hashés et ne sont jamais stockés en clair. L\'authentification sociale (Google, TikTok) est gérée par les fournisseurs d\'identité respectifs selon leurs propres standards de sécurité.'
  },
  {
    icon: <Globe className="w-4 h-4" />,
    title: 'Cookies et traceurs',
    content: 'Inkyo utilise des cookies essentiels pour le fonctionnement du service (session, préférences). Des cookies analytiques peuvent être utilisés pour comprendre l\'utilisation de la plateforme. Les publicités vidéo pour le contenu gratuit peuvent utiliser des cookies tiers. Les abonnés Premium ne sont pas exposés aux publicités.'
  },
  {
    icon: <Trash2 className="w-4 h-4" />,
    title: 'Vos droits',
    content: 'Conformément au RGPD et aux lois applicables, vous disposez d\'un droit d\'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez supprimer votre compte à tout moment depuis les paramètres. La suppression entraîne l\'effacement de vos données personnelles sous 30 jours.'
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: 'Protection des mineurs',
    content: 'Inkyo est accessible aux personnes de 13 ans et plus. Nous ne collectons pas sciemment de données de mineurs de moins de 13 ans. Les contenus sont modérés pour assurer un environnement sûr. Les parents peuvent nous contacter pour toute question relative aux données de leurs enfants.'
  },
];

export default function ConfidentialitePage() {
  return (
    <div className="pt-20 pb-24 md:pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-premium/15 flex items-center justify-center">
              <Shield className="w-6 h-6 text-premium" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink-white">Politique de confidentialité</h1>
              <p className="text-sm text-ink-muted">Comment nous protégeons vos données</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-5 bg-ink-card rounded-xl border border-ink-border/20"
            >
              <h2 className="text-sm font-bold text-ink-white mb-2 flex items-center gap-2">
                <span className="text-premium">{s.icon}</span> {s.title}
              </h2>
              <p className="text-xs text-ink-muted leading-relaxed">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
