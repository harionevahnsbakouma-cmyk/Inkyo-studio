import { Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { ActivePage } from '../store/useStore';

export default function Footer() {
  const { setActivePage, setShowPublishModal, setShowPremiumModal, setShowDashboard, isAuthenticated, setShowAuthModal } = useStore();

  const navigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatorAction = (action: 'publish' | 'dashboard' | 'premium') => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (action === 'publish') setShowPublishModal(true);
    if (action === 'dashboard') setShowDashboard(true);
    if (action === 'premium') setShowPremiumModal(true);
  };

  return (
    <footer className="border-t border-ink-border/30 py-8 mt-10 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <img src="/images/inkyo-logo.png" alt="Inkyo" className="h-8 mb-3" />
            <p className="text-xs text-ink-muted">La plateforme hybride de manga indépendant. Lisez, créez, votez.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-white mb-3">Plateforme</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('accueil')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Accueil</button></li>
              <li><button onClick={() => navigate('classement')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Classement</button></li>
              <li><button onClick={() => navigate('votes')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Votes & Édition papier</button></li>
              <li><button onClick={() => navigate('a-propos')} className="text-xs text-ink-muted hover:text-crimson transition-colors">À propos</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-white mb-3">Créateurs</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleCreatorAction('publish')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Publier</button></li>
              <li><button onClick={() => handleCreatorAction('dashboard')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Dashboard</button></li>
              <li><button onClick={() => handleCreatorAction('premium')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Premium</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-white mb-3">Support</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('aide')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Centre d'aide</button></li>
              <li><button onClick={() => navigate('conditions')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Conditions</button></li>
              <li><button onClick={() => navigate('confidentialite')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Confidentialité</button></li>
              <li><button onClick={() => navigate('contact')} className="text-xs text-ink-muted hover:text-crimson transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-border/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-muted">© 2025 Inkyo. Tous droits réservés.</p>
          <p className="text-xs text-ink-muted flex items-center gap-1">
            Fait avec <Heart className="w-3 h-3 text-crimson fill-crimson" /> pour les créateurs
          </p>
        </div>
      </div>
    </footer>
  );
}
