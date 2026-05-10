import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BarChart3, Eye, Heart, TrendingUp, DollarSign, Upload, Settings,
  Award, Users, BookOpen, MessageSquare, CheckCheck, Clock, ArrowRight,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Comment } from '../store/useStore';
import { BADGES } from '../data/works';

export default function DashboardModal() {
  const {
    showDashboard, setShowDashboard, user, setShowPublishModal,
    comments, markCommentsRead,
  } = useStore();
  const [tab, setTab] = useState<'stats' | 'works' | 'messages' | 'revenue' | 'badges'>('stats');
  const [selectedWorkFilter, setSelectedWorkFilter] = useState<string>('all');

  if (!showDashboard) return null;

  const unreadCount = comments.filter((c: Comment) => !c.isRead).length;

  // Group comments by work
  const commentsByWork: Record<string, Comment[]> = {};
  comments.forEach((c: Comment) => {
    if (!commentsByWork[c.workId]) commentsByWork[c.workId] = [];
    commentsByWork[c.workId].push(c);
  });

  const filteredComments = selectedWorkFilter === 'all'
    ? [...comments].reverse()
    : [...comments].filter((c: Comment) => c.workId === selectedWorkFilter).reverse();

  const uniqueWorks = Array.from(new Set(comments.map((c: Comment) => c.workId))).map((id: string) => {
    const comment = comments.find((c: Comment) => c.workId === id);
    return { id, title: comment?.workTitle || '' };
  });

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return `il y a ${Math.floor(diff / 86400)}j`;
  };

  const stats = [
    { label: 'Vues totales', value: '0', icon: <Eye className="w-4 h-4" />, color: 'text-crimson', bg: 'bg-crimson/10' },
    { label: 'Likes', value: '0', icon: <Heart className="w-4 h-4" />, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Abonnés', value: '0', icon: <Users className="w-4 h-4" />, color: 'text-eumene', bg: 'bg-eumene/10' },
    { label: 'Messages', value: String(comments.length), icon: <MessageSquare className="w-4 h-4" />, color: 'text-premium', bg: 'bg-premium/10' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center p-4"
        onClick={() => setShowDashboard(false)}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl glass-card rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-ink-border/30 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-crimson to-gold flex items-center justify-center text-white text-lg font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-white">Dashboard Créateur</h2>
                  <p className="text-sm text-ink-muted">{user?.name || 'Créateur'}</p>
                </div>
              </div>
              <button onClick={() => setShowDashboard(false)} className="text-ink-muted hover:text-ink-white"><X className="w-5 h-5" /></button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 bg-ink-dark rounded-lg p-0.5 overflow-x-auto hide-scrollbar">
              {[
                { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                { id: 'works', label: 'Œuvres', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-3.5 h-3.5" />, badge: unreadCount },
                { id: 'revenue', label: 'Revenus', icon: <DollarSign className="w-3.5 h-3.5" /> },
                { id: 'badges', label: 'Badges', icon: <Award className="w-3.5 h-3.5" /> },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap min-w-0 ${
                    tab === t.id ? 'bg-crimson text-white' : 'text-ink-muted hover:text-ink-text'
                  }`}
                >
                  {t.icon} {t.label}
                  {'badge' in t && t.badge !== undefined && t.badge > 0 && (
                    <span className={`absolute -top-1 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                      tab === t.id ? 'bg-white text-crimson' : 'bg-crimson text-white'
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content — scrollable */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* ===== STATS ===== */}
            {tab === 'stats' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-ink-dark rounded-xl border border-ink-border/30"
                    >
                      <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-2`}>{s.icon}</div>
                      <p className="text-2xl font-bold text-ink-white">{s.value}</p>
                      <p className="text-xs text-ink-muted">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-ink-dark rounded-xl border border-ink-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-ink-text">Vues cette semaine</p>
                    <span className="text-xs text-ink-muted flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 0%</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-20">
                    {[0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-linear-to-t from-crimson to-crimson/40 rounded-t min-h-0.5"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                      <span key={i} className="text-[10px] text-ink-muted flex-1 text-center">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== WORKS ===== */}
            {tab === 'works' && (
              <div className="space-y-3">
                <button
                  onClick={() => { setShowDashboard(false); setShowPublishModal(true); }}
                  className="w-full p-4 border-2 border-dashed border-crimson/30 rounded-xl text-center hover:border-crimson/60 hover:bg-crimson/5 transition-all group"
                >
                  <Upload className="w-8 h-8 text-crimson mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-ink-text">Publier une nouvelle œuvre</p>
                  <p className="text-xs text-ink-muted mt-1">Ou utilisez le Bulk Upload pour 1000+ épisodes</p>
                </button>

                {['Chroniques de l\'Ombre', 'Néon Tokyo 2099'].map((title, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-ink-dark rounded-xl border border-ink-border/30">
                    <div className="w-12 h-16 rounded-lg bg-ink-card overflow-hidden">
                      <img src={`/images/manga-cover-${i + 1}.jpg`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-white truncate">{title}</p>
                      <p className="text-xs text-ink-muted">0 épisodes • 0 vues</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs bg-ink-card border border-ink-border/50 rounded-lg text-ink-text hover:text-crimson transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ===== MESSAGES / COMMENTS ===== */}
            {tab === 'messages' && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-3 bg-ink-dark rounded-xl border border-ink-border/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-premium/10 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-premium" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-ink-white">{comments.length}</p>
                      <p className="text-[11px] text-ink-muted">messages reçus</p>
                    </div>
                  </div>
                  <div className="flex-1 p-3 bg-ink-dark rounded-xl border border-ink-border/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-crimson/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-crimson" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-ink-white">{unreadCount}</p>
                      <p className="text-[11px] text-ink-muted">non lus</p>
                    </div>
                  </div>
                </div>

                {/* Filter by work */}
                {uniqueWorks.length > 0 && (
                  <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
                    <button
                      onClick={() => setSelectedWorkFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedWorkFilter === 'all'
                          ? 'bg-crimson text-white'
                          : 'bg-ink-dark border border-ink-border/30 text-ink-muted hover:text-ink-text'
                      }`}
                    >
                      Tous ({comments.length})
                    </button>
                    {uniqueWorks.map((w: { id: string; title: string }) => {
                      const count = commentsByWork[w.id]?.length || 0;
                      const unread = commentsByWork[w.id]?.filter((c: Comment) => !c.isRead).length || 0;
                      return (
                        <button
                          key={w.id}
                          onClick={() => {
                            setSelectedWorkFilter(w.id);
                            markCommentsRead(w.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            selectedWorkFilter === w.id
                              ? 'bg-crimson text-white'
                              : 'bg-ink-dark border border-ink-border/30 text-ink-muted hover:text-ink-text'
                          }`}
                        >
                          {w.title}
                          <span className="opacity-70">({count})</span>
                          {unread > 0 && selectedWorkFilter !== w.id && (
                            <span className="w-2 h-2 rounded-full bg-crimson shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Messages list */}
                {filteredComments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-ink-card flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-7 h-7 text-ink-muted" />
                    </div>
                    <p className="text-sm font-medium text-ink-text">Aucun message reçu</p>
                    <p className="text-xs text-ink-muted mt-1">Les commentaires des lecteurs sur vos œuvres apparaîtront ici.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredComments.map((comment, i) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={`p-3 rounded-xl border transition-all ${
                          comment.isRead
                            ? 'bg-ink-dark/60 border-ink-border/20'
                            : 'bg-ink-dark border-crimson/20 border-l-2 border-l-crimson'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-crimson/70 to-gold/70 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-ink-white">{comment.authorName}</span>
                              <ArrowRight className="w-3 h-3 text-ink-muted" />
                              <span className="text-xs text-crimson font-medium truncate">{comment.workTitle}</span>
                              <span className="text-[10px] text-ink-muted ml-auto shrink-0">{formatTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-[13px] text-ink-text mt-1 leading-relaxed">{comment.text}</p>
                            {!comment.isRead && (
                              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-crimson font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-crimson" /> Nouveau
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Mark all read */}
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      uniqueWorks.forEach((w: { id: string; title: string }) => markCommentsRead(w.id));
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-ink-muted hover:text-ink-text border border-ink-border/30 rounded-xl hover:bg-ink-border/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Tout marquer comme lu
                  </button>
                )}
              </div>
            )}

            {/* ===== REVENUE ===== */}
            {tab === 'revenue' && (
              <div className="space-y-4">
                <div className="p-4 bg-linear-to-br from-premium-dark/20 to-premium/10 rounded-xl border border-premium/30">
                  <p className="text-xs text-premium mb-1">Revenus totaux</p>
                  <p className="text-3xl font-black text-ink-white">0.00€</p>
                  <p className="text-xs text-ink-muted mt-1">Depuis le début</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-ink-dark rounded-xl border border-ink-border/30">
                    <p className="text-xs text-ink-muted">Part globale (20%)</p>
                    <p className="text-lg font-bold text-gold">0.00€</p>
                  </div>
                  <div className="p-3 bg-ink-dark rounded-xl border border-ink-border/30">
                    <p className="text-xs text-ink-muted">Part directe (15%)</p>
                    <p className="text-lg font-bold text-eumene">0.00€</p>
                  </div>
                </div>

                <div className="p-3 bg-ink-dark rounded-xl border border-ink-border/30">
                  <p className="text-sm font-medium text-ink-text mb-2">Modes de retrait</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-ink-card rounded-lg">
                      <span className="text-sm text-ink-text">💳 PayPal</span>
                      <span className="text-xs text-eumene">Connecté</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-ink-card rounded-lg">
                      <span className="text-sm text-ink-text">📱 MTN Mobile Money</span>
                      <button className="text-xs text-crimson">Configurer</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== BADGES ===== */}
            {tab === 'badges' && (
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((badge, i) => {
                  const earned = i < 3;
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-3 rounded-xl border text-center ${
                        earned ? 'bg-ink-dark border-gold/30' : 'bg-ink-dark/50 border-ink-border/20 opacity-50'
                      }`}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <p className="text-xs font-semibold text-ink-white mt-1">{badge.name}</p>
                      <p className="text-[10px] text-ink-muted mt-0.5">{badge.desc}</p>
                      {earned && <span className="inline-block mt-1 px-2 py-0.5 bg-gold/20 text-gold text-[9px] font-bold rounded-full">✓ Obtenu</span>}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
