import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useStore();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleEmailLogin = () => {
    login({
      id: '1',
      name: name || 'Créateur Inkyo',
      email: email || 'user@inkyo.app',
      avatar: '',
      isPremium: false,
      badges: ['first-read'],
      works: 0,
      followers: 0,
    });
  };

  const handleSocialLogin = (provider: string) => {
    login({
      id: '1',
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      avatar: '',
      isPremium: false,
      badges: ['first-read'],
      works: 0,
      followers: 0,
    });
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={() => setShowAuthModal(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 bg-linear-to-b from-crimson/20 to-transparent">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-ink-muted hover:text-ink-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <img src="/images/inkyo-logo.png" alt="Inkyo" className="h-10 mb-3" />
              <p className="text-ink-muted text-sm">Rejoignez la plus grande communauté de manga indépendant</p>
            </div>

            {/* Tabs */}
            <div className="flex mx-6 bg-ink-dark rounded-lg p-0.5">
              <button onClick={() => setTab('login')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tab === 'login' ? 'bg-crimson text-white' : 'text-ink-muted'}`}>Connexion</button>
              <button onClick={() => setTab('signup')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tab === 'signup' ? 'bg-crimson text-white' : 'text-ink-muted'}`}>Inscription</button>
            </div>

            {/* Social Login */}
            <div className="p-6 space-y-3">
              <button onClick={() => handleSocialLogin('Google')} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-ink-border/50 rounded-xl hover:bg-white/10 transition-all group">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-sm text-ink-text group-hover:text-ink-white">Continuer avec Google</span>
              </button>

              <button onClick={() => handleSocialLogin('TikTok')} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-ink-border/50 rounded-xl hover:bg-white/10 transition-all group">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" fill="#fff"/></svg>
                <span className="text-sm text-ink-text group-hover:text-ink-white">Continuer avec TikTok</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-ink-border/30" />
                <span className="text-xs text-ink-muted">ou par e-mail</span>
                <div className="flex-1 h-px bg-ink-border/30" />
              </div>

              {/* Email Form */}
              {tab === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom d'artiste"
                    className="w-full bg-ink-dark border border-ink-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-ink-dark border border-ink-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full bg-ink-dark border border-ink-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50"
                />
              </div>

              <button
                onClick={handleEmailLogin}
                className="w-full flex items-center justify-center gap-2 py-3 bg-crimson hover:bg-crimson-dark text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-crimson/30"
              >
                {tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
