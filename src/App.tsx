import { Flame, Sparkles, TrendingUp, Clock, Crown } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PinnedWork from './components/PinnedWork';
import ContentRail from './components/ContentRail';
import CollaborationSection from './components/CollaborationSection';
import BroadcastSection from './components/BroadcastSection';
import EumeneSection from './components/EumeneSection';
import ClassementPage from './components/ClassementPage';
import VotesPage from './components/VotesPage';
import AidePage from './components/pages/AidePage';
import ConditionsPage from './components/pages/ConditionsPage';
import ConfidentialitePage from './components/pages/ConfidentialitePage';
import ContactPage from './components/pages/ContactPage';
import AProposPage from './components/pages/AProposPage';
import AuthModal from './components/AuthModal';
import ReaderView from './components/ReaderView';
import PublishModal from './components/PublishModal';
import PremiumModal from './components/PremiumModal';
import DashboardModal from './components/DashboardModal';
import Footer from './components/Footer';
import { useStore } from './store/useStore';
import { WORKS } from './data/works';

function App() {
  const { mode, activePage } = useStore();

  const trending = WORKS.filter(w => w.isTrending);
  const newWorks = WORKS.filter(w => w.isNew);
  const premium = WORKS.filter(w => w.isPremium);
  const all = WORKS;

  return (
    <div className="min-h-screen bg-ink-black">
      <Navbar />

      {activePage === 'accueil' && (
        <>
          <HeroSection />

          {mode === 'inkyo' ? (
            <>
              <PinnedWork />

              {trending.length > 0 && (
                <ContentRail
                  title="Trending"
                  works={trending}
                  icon={<Flame className="w-5 h-5 text-crimson" />}
                />
              )}
              {newWorks.length > 0 && (
                <ContentRail
                  title="Nouveautés"
                  works={newWorks}
                  icon={<Sparkles className="w-5 h-5 text-eumene" />}
                />
              )}
              {all.length > 0 && (
                <ContentRail
                  title="Les plus populaires"
                  works={[...all].sort((a, b) => parseInt(b.views) - parseInt(a.views))}
                  icon={<TrendingUp className="w-5 h-5 text-gold" />}
                />
              )}
              {premium.length > 0 && (
                <ContentRail
                  title="Premium"
                  works={premium}
                  icon={<Crown className="w-5 h-5 text-premium" />}
                />
              )}
              {all.length > 0 && (
                <ContentRail
                  title="Récemment mis à jour"
                  works={[...all].reverse()}
                  icon={<Clock className="w-5 h-5 text-ink-muted" />}
                />
              )}

              <BroadcastSection />
              <CollaborationSection />
            </>
          ) : (
            <EumeneSection />
          )}
        </>
      )}

      {activePage === 'classement' && <ClassementPage />}
      {activePage === 'votes' && <VotesPage />}
      {activePage === 'aide' && <AidePage />}
      {activePage === 'conditions' && <ConditionsPage />}
      {activePage === 'confidentialite' && <ConfidentialitePage />}
      {activePage === 'contact' && <ContactPage />}
      {activePage === 'a-propos' && <AProposPage />}

      <Footer />

      {/* Modals */}
      <AuthModal />
      <ReaderView />
      <PublishModal />
      
      {/* ASTUCE : Si la fenêtre de paiement s'affiche encore de force, 
          tu peux commenter la ligne ci-dessous le temps de tes tests.
      */}
      <PremiumModal /> 
      
      <DashboardModal />
    </div>
  );
}

export default App;