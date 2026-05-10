import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Crown, User, Menu, X,
  LayoutDashboard, LogOut, PenLine,
  Home, Trophy, Vote,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { ActivePage } from '../store/useStore';

const NAV_ITEMS: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
  { id: 'accueil', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
  { id: 'classement', label: 'Classement', icon: <Trophy className="w-4 h-4" /> },
  { id: 'votes', label: 'Votes', icon: <Vote className="w-4 h-4" /> },
];

export default function Navbar() {
  const {
    isAuthenticated, user, activePage, setActivePage,
    setShowAuthModal, setShowPublishModal, setShowDashboard,
    setShowPremiumModal, logout,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePublish = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowPublishModal(true);
    }
  };

  const navigate = (page: ActivePage) => {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ===== NAVBAR — single flex row ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-ink-border/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">

          {/* 1. Logo */}
          <button onClick={() => navigate('accueil')} className="shrink-0 mr-1">
            <img src="/images/inkyo-logo.png" alt="Inkyo" className="h-6 sm:h-7 w-auto" />
          </button>

          {/* 2. Nav Links — desktop */}
          <div className="hidden md:flex items-center gap-0.5 shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-ink-white bg-ink-border/10'
                      : 'text-ink-muted hover:text-ink-text hover:bg-ink-border/10'
                  }`}
                >
                  <span className={isActive ? 'text-crimson' : ''}>{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-[9px] left-2 right-2 h-[2px] bg-crimson rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. Search Bar — fills remaining space */}
          <div className="flex-1 min-w-0 mx-1 sm:mx-2">
            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-ink-dark/70 border border-ink-border/30 rounded-full pl-9 pr-8 py-1.5 text-[13px] text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-text">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 4. Publier */}
          <button
            onClick={handlePublish}
            className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-crimson hover:bg-crimson-dark text-white text-[13px] font-bold rounded-full transition-all hover:shadow-lg hover:shadow-crimson/40 active:scale-95"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publier</span>
          </button>

          {/* 5. Auth / Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button className="relative p-1.5 text-ink-muted hover:text-ink-text transition-colors hidden sm:flex">
                <Bell className="w-4 h-4" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-crimson rounded-full" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-7 h-7 rounded-full bg-linear-to-br from-crimson to-gold flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent hover:ring-crimson/30 transition-all"
                >
                  {user?.name?.charAt(0) || 'U'}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-52 glass-card rounded-xl p-1.5 shadow-2xl"
                    >
                      <div className="px-3 py-2 border-b border-ink-border/30 mb-1">
                        <p className="text-sm font-semibold text-ink-white">{user?.name}</p>
                        <p className="text-[11px] text-ink-muted">{user?.email}</p>
                      </div>
                      <button onClick={() => { setShowDashboard(true); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-text hover:bg-ink-border/20 rounded-lg transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </button>
                      <button onClick={() => { setShowPremiumModal(true); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-text hover:bg-ink-border/20 rounded-lg transition-colors">
                        <Crown className="w-4 h-4" /> Premium
                      </button>
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-crimson hover:bg-crimson/10 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-ink-card border border-ink-border/40 hover:border-ink-border text-ink-text text-[13px] font-semibold rounded-full transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Connexion</span>
            </button>
          )}

          {/* 6. Hamburger — mobile only */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden shrink-0 p-1.5 text-ink-muted hover:text-ink-text">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ===== MOBILE DROPDOWN MENU ===== */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-ink-border/30 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-crimson/10 text-crimson border border-crimson/30'
                          : 'text-ink-text hover:bg-ink-border/10 border border-transparent'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
                {isAuthenticated && (
                  <>
                    <div className="h-px bg-ink-border/20 my-1" />
                    <button onClick={() => { setShowPremiumModal(true); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-premium hover:bg-premium/10 transition-all">
                      <Crown className="w-4 h-4" /> Premium
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-ink-border/30 safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all ${
                  isActive ? 'text-crimson' : 'text-ink-muted'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab"
                    className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-crimson rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {item.icon}
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}

          {/* Publier — center elevated */}
          <button
            onClick={handlePublish}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-ink-muted"
          >
            <div className="w-9 h-9 -mt-3 bg-crimson rounded-full flex items-center justify-center shadow-lg shadow-crimson/40">
              <PenLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-semibold text-crimson">Publier</span>
          </button>
        </div>
      </div>
    </>
  );
}
