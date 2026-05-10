import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Acceptation des conditions',
    content: 'En accédant à la plateforme Inkyo, vous acceptez les présentes conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser le service. Inkyo se réserve le droit de modifier ces conditions à tout moment.'
  },
  {
    title: '2. Inscription et compte',
    content: 'L\'inscription est gratuite et ouverte à toute personne de plus de 13 ans. Vous êtes responsable de la confidentialité de vos identifiants. Toute activité réalisée sous votre compte est de votre responsabilité. Inkyo propose l\'authentification via Google, TikTok ou par e-mail.'
  },
  {
    title: '3. Publication de contenu',
    content: 'En publiant du contenu sur Inkyo, vous garantissez être l\'auteur original ou détenir les droits nécessaires. Vous conservez la propriété intellectuelle de vos œuvres. Inkyo obtient une licence non-exclusive pour afficher et distribuer votre contenu sur la plateforme. Tout contenu illégal, haineux ou portant atteinte aux droits d\'autrui sera supprimé.'
  },
  {
    title: '4. Votes et édition papier',
    content: 'Le système de votes permet à la communauté de sélectionner les œuvres qui seront éditées en version papier. Les résultats des votes sont indicatifs. Inkyo se réserve le droit de décision finale concernant l\'édition papier. Les œuvres sélectionnées feront l\'objet d\'un contrat d\'édition séparé avec l\'auteur.'
  },
  {
    title: '5. Monétisation et revenus',
    content: 'Les créateurs éligibles reçoivent une part des revenus selon le modèle suivant : 20% du pool global de revenus publicitaires et abonnements, plus 15% de soutien direct des abonnés Premium. Les paiements sont effectués via PayPal ou MTN Mobile Money. Un seuil minimum de retrait peut s\'appliquer.'
  },
  {
    title: '6. Abonnement Premium',
    content: 'L\'abonnement Premium est un service payant offrant des avantages supplémentaires. L\'abonnement se renouvelle automatiquement sauf annulation. Vous pouvez annuler à tout moment depuis votre compte. Aucun remboursement n\'est effectué pour la période en cours.'
  },
  {
    title: '7. Comportement des utilisateurs',
    content: 'Les utilisateurs s\'engagent à respecter la communauté. Sont interdits : le harcèlement, le spam, l\'usurpation d\'identité, la diffusion de contenu inapproprié. Inkyo peut suspendre ou supprimer tout compte en infraction sans préavis.'
  },
  {
    title: '8. Propriété intellectuelle',
    content: 'La marque Inkyo, le logo, le design et le code source de la plateforme sont la propriété d\'Inkyo. Toute reproduction non autorisée est interdite. Les œuvres publiées restent la propriété de leurs auteurs respectifs.'
  },
  {
    title: '9. Limitation de responsabilité',
    content: 'Inkyo est fourni "en l\'état". Nous ne garantissons pas la disponibilité permanente du service. Inkyo n\'est pas responsable des pertes de données ou des dommages indirects liés à l\'utilisation de la plateforme.'
  },
  {
    title: '10. Contact',
    content: 'Pour toute question relative à ces conditions, veuillez nous contacter via la page Contact de la plateforme ou par e-mail à contact@inkyo.app.'
  },
];

export default function ConditionsPage() {
  return (
    <div className="pt-20 pb-24 md:pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink-white">Conditions d'utilisation</h1>
              <p className="text-sm text-ink-muted">Dernière mise à jour : Janvier 2025</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-5 bg-ink-card rounded-xl border border-ink-border/20"
            >
              <h2 className="text-sm font-bold text-ink-white mb-2">{s.title}</h2>
              <p className="text-xs text-ink-muted leading-relaxed">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
