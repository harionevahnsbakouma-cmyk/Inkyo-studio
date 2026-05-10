import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Send, X, AlertTriangle, HelpCircle, Info, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Broadcast } from '../store/useStore';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '💪', '🙏'];

const CATEGORIES = [
  { id: 'problem', label: 'Problème', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-crimson' },
  { id: 'question', label: 'Question', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'text-gold' },
  { id: 'info', label: 'Info', icon: <Info className="w-3.5 h-3.5" />, color: 'text-eumene' },
];

export default function BroadcastSection() {
  const {
    isAuthenticated, broadcasts, addBroadcast, addReaction,
    setShowAuthModal,
  } = useStore();

  const [showCompose, setShowCompose] = useState(false);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('problem');

  const handleSend = () => {
    if (!message.trim()) return;
    const cat = CATEGORIES.find(c => c.id === category);
    const prefix = cat ? `[${cat.label}] ` : '';
    addBroadcast(prefix + message.trim());
    setMessage('');
    setShowCompose(false);
  };

  const handleReaction = (broadcastId: string, emoji: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addReaction(broadcastId, emoji);
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return `il y a ${Math.floor(diff / 86400)}j`;
  };

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crimson/15 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-crimson" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-white">Annonces des auteurs</h2>
              <p className="text-sm text-ink-muted">Messages de la communauté — réagissez avec des emojis</p>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="flex items-center gap-1.5 px-4 py-2 bg-crimson hover:bg-crimson-dark text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-crimson/30 active:scale-95"
            >
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Annoncer</span>
            </button>
          )}
        </div>

        {/* Compose Box */}
        <AnimatePresence>
          {showCompose && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 bg-ink-card rounded-xl border border-ink-border/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-ink-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-crimson" />
                    Envoyer une annonce à tous les membres
                  </p>
                  <button onClick={() => setShowCompose(false)} className="text-ink-muted hover:text-ink-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Category */}
                <div className="flex gap-2 mb-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        category === cat.id
                          ? 'bg-crimson/15 text-crimson border border-crimson/30'
                          : 'bg-ink-dark text-ink-muted border border-transparent hover:text-ink-text'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Message input */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre problème, posez une question ou partagez une info..."
                  rows={3}
                  className="w-full bg-ink-dark border border-ink-border/30 rounded-xl px-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 resize-none transition-all mb-3"
                />

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-ink-muted">
                    Les membres pourront réagir avec des emojis
                  </p>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      message.trim()
                        ? 'bg-crimson text-white hover:bg-crimson-dark active:scale-95'
                        : 'bg-ink-dark text-ink-muted cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" /> Envoyer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Broadcasts List */}
        {broadcasts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-ink-card flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-ink-muted" />
            </div>
            <p className="text-sm font-medium text-ink-text">Aucune annonce pour le moment</p>
            <p className="text-xs text-ink-muted mt-1">Les auteurs peuvent publier des annonces ici</p>
          </div>
        ) : (
          <div className="space-y-3">
            {broadcasts.map((broadcast: Broadcast, i: number) => (
              <motion.div
                key={broadcast.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 bg-ink-card rounded-xl border border-ink-border/30 hover:border-ink-border/50 transition-all"
              >
                {/* Author + Time */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-crimson to-gold flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {broadcast.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-ink-white">{broadcast.authorName}</span>
                    <span className="text-[11px] text-ink-muted ml-2">{formatTime(broadcast.timestamp)}</span>
                  </div>
                  {broadcast.text.startsWith('[Problème]') && (
                    <span className="px-2 py-0.5 bg-crimson/10 border border-crimson/20 rounded-full text-[10px] text-crimson font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Problème
                    </span>
                  )}
                  {broadcast.text.startsWith('[Question]') && (
                    <span className="px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-full text-[10px] text-gold font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Question
                    </span>
                  )}
                  {broadcast.text.startsWith('[Info]') && (
                    <span className="px-2 py-0.5 bg-eumene/10 border border-eumene/20 rounded-full text-[10px] text-eumene font-semibold flex items-center gap-1">
                      <Info className="w-3 h-3" /> Info
                    </span>
                  )}
                </div>

                {/* Message */}
                <p className="text-[13px] text-ink-text leading-relaxed mb-3 pl-[42px]">
                  {broadcast.text.replace(/^\[(Problème|Question|Info)\]\s*/, '')}
                </p>

                {/* Emoji Reactions */}
                <div className="flex items-center gap-1.5 flex-wrap pl-[42px]">
                  {EMOJI_OPTIONS.map(emoji => {
                    const count = broadcast.reactions[emoji] || 0;
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(broadcast.id, emoji)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all active:scale-90 ${
                          count > 0
                            ? 'bg-crimson/10 border border-crimson/20 text-ink-white'
                            : 'bg-ink-dark/60 border border-ink-border/20 text-ink-muted hover:bg-ink-dark hover:border-ink-border/40'
                        }`}
                      >
                        <span className="text-sm">{emoji}</span>
                        {count > 0 && <span className="font-semibold text-[11px]">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
