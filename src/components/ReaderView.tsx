import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  ArrowUpDown, ArrowLeftRight, MessageSquare, Heart, Share2,
  BookOpen, Send, SmilePlus, User,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Comment } from '../store/useStore';

const SAMPLE_PAGES = [
  '/images/manga-cover-1.jpg',
  '/images/manga-cover-2.jpg',
  '/images/manga-cover-3.jpg',
  '/images/manga-cover-4.jpg',
  '/images/manga-cover-5.jpg',
  '/images/hero-manga.jpg',
];

export default function ReaderView() {
  const {
    showReader, setShowReader, currentWork, readerMode, setReaderMode,
    isAuthenticated, setShowAuthModal, comments, addComment,
  } = useStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showAd, setShowAd] = useState(true);
  const [adCountdown, setAdCountdown] = useState(5);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Comment panel
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const workComments = currentWork
    ? comments.filter((c: Comment) => c.workId === currentWork.id)
    : [];

  useEffect(() => {
    if (showAd && adCountdown > 0) {
      const t = setTimeout(() => setAdCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [showAd, adCountdown]);

  // Auto-scroll comments to bottom
  useEffect(() => {
    if (showComments && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [workComments.length, showComments]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, SAMPLE_PAGES.length - 1));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 0));

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!currentWork) return;
    addComment(currentWork.id, currentWork.title, commentText.trim());
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleClose = () => {
    setShowReader(false);
    setShowAd(true);
    setAdCountdown(5);
    setCurrentPage(0);
    setShowComments(false);
    setLiked(false);
    setLikeCount(0);
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return `il y a ${Math.floor(diff / 86400)}j`;
  };

  if (!showReader || !currentWork) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-ink-black flex flex-col"
      >
        {/* Ad Overlay */}
        {showAd && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="text-center">
              <div className="w-80 h-48 bg-ink-card rounded-xl flex items-center justify-center mb-4 border border-ink-border/30">
                <div className="text-center">
                  <p className="text-ink-muted text-sm mb-2">Publicité vidéo</p>
                  <div className="w-16 h-16 rounded-full border-4 border-crimson/30 border-t-crimson animate-spin mx-auto" />
                </div>
              </div>
              <p className="text-ink-muted text-sm mb-3">Contenu gratuit soutenu par la publicité</p>
              {adCountdown > 0 ? (
                <p className="text-ink-text text-sm">Passer dans <span className="text-crimson font-bold">{adCountdown}s</span></p>
              ) : (
                <button onClick={() => setShowAd(false)} className="px-6 py-2 bg-crimson text-white rounded-lg font-semibold hover:bg-crimson-dark transition-colors">
                  Passer la publicité ▶
                </button>
              )}
              <p className="text-xs text-ink-muted mt-4">👑 <button onClick={() => setShowAd(false)} className="text-premium underline">Passez Premium</button> pour une lecture sans pub</p>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ y: -60 }}
              animate={{ y: 0 }}
              exit={{ y: -60 }}
              className="absolute top-0 left-0 right-0 z-40 glass border-b border-ink-border/20 px-4 h-14 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <button onClick={handleClose} className="p-2 text-ink-muted hover:text-ink-white">
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-sm font-semibold text-ink-white truncate max-w-[200px]">{currentWork.title}</h3>
                  <p className="text-xs text-ink-muted">Épisode 1 · Page {currentPage + 1}/{SAMPLE_PAGES.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReaderMode(readerMode === 'vertical' ? 'horizontal' : 'vertical')}
                  className="p-2 text-ink-muted hover:text-ink-white transition-colors"
                >
                  {readerMode === 'vertical' ? <ArrowLeftRight className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
                </button>
                <button onClick={toggleFullscreen} className="p-2 text-ink-muted hover:text-ink-white">
                  {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reader + Comment Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Reader Content */}
          <div className={`flex-1 flex flex-col transition-all ${showComments ? 'hidden sm:flex' : ''}`}>
            {readerMode === 'vertical' ? (
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto"
                onClick={() => setShowControls(!showControls)}
              >
                <div className="max-w-3xl mx-auto">
                  {SAMPLE_PAGES.map((page, i) => (
                    <img key={i} src={page} alt={`Page ${i + 1}`} className="w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="flex-1 flex items-center justify-center relative"
                onClick={() => setShowControls(!showControls)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPage}
                    src={SAMPLE_PAGES[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="max-h-full max-w-full object-contain"
                  />
                </AnimatePresence>
                <button onClick={(e) => { e.stopPropagation(); prevPage(); }} className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity">
                  <ChevronLeft className="w-10 h-10 text-white/50" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextPage(); }} className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-10 h-10 text-white/50" />
                </button>
              </div>
            )}
          </div>

          {/* ===== COMMENT PANEL ===== */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="w-full sm:w-85 shrink-0 flex flex-col bg-ink-dark border-l border-ink-border/30 z-30"
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink-border/30">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-crimson" />
                    <h3 className="text-sm font-bold text-ink-white">Commentaires</h3>
                    <span className="px-1.5 py-0.5 bg-crimson/15 text-crimson text-[10px] font-bold rounded-full">
                      {workComments.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowComments(false)}
                    className="p-1.5 rounded-lg hover:bg-ink-border/20 text-ink-muted hover:text-ink-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {workComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-ink-card flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-ink-muted" />
                      </div>
                      <p className="text-sm font-medium text-ink-text">Aucun commentaire</p>
                      <p className="text-xs text-ink-muted mt-1 max-w-[200px]">
                        Soyez le premier à envoyer un message à l'auteur !
                      </p>
                    </div>
                  ) : (
                    workComments.map((comment: Comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="group"
                      >
                        <div className="flex gap-2.5">
                          {/* Avatar */}
                          <div className="w-7 h-7 rounded-full bg-linear-to-br from-crimson/80 to-gold/80 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          {/* Bubble */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-ink-white">{comment.authorName}</span>
                              <span className="text-[10px] text-ink-muted">{formatTime(comment.timestamp)}</span>
                            </div>
                            <div className="px-3 py-2 bg-ink-card rounded-xl rounded-tl-sm border border-ink-border/20">
                              <p className="text-[13px] text-ink-text leading-relaxed break-words">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-3 py-3 border-t border-ink-border/30 bg-ink-dark">
                  {!isAuthenticated ? (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full py-3 bg-ink-card border border-ink-border/30 rounded-xl text-sm text-ink-muted hover:text-ink-text hover:border-ink-border/60 transition-all flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Connectez-vous pour commenter
                    </button>
                  ) : (
                    <div className="flex items-end gap-2">
                      <div className="flex-1 relative">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Écrire à l'auteur..."
                          rows={1}
                          className="w-full bg-ink-card border border-ink-border/30 rounded-xl px-3 py-2.5 pr-10 text-[13px] text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 resize-none transition-all max-h-24 overflow-y-auto"
                          style={{ minHeight: '40px' }}
                          onInput={(e) => {
                            const t = e.target as HTMLTextAreaElement;
                            t.style.height = '40px';
                            t.style.height = Math.min(t.scrollHeight, 96) + 'px';
                          }}
                        />
                        <button className="absolute right-2 bottom-2 p-1 text-ink-muted hover:text-ink-text transition-colors">
                          <SmilePlus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={handleSendComment}
                        disabled={!commentText.trim()}
                        className={`p-2.5 rounded-xl transition-all shrink-0 ${
                          commentText.trim()
                            ? 'bg-crimson text-white hover:bg-crimson-dark shadow-md shadow-crimson/20 active:scale-95'
                            : 'bg-ink-card text-ink-muted cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              className="absolute bottom-0 left-0 right-0 z-40 glass border-t border-ink-border/20 px-4 py-3"
            >
              <div className="max-w-3xl mx-auto">
                <div className="h-1 bg-ink-dark rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-crimson rounded-full transition-all" style={{ width: `${((currentPage + 1) / SAMPLE_PAGES.length) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-1 transition-colors ${liked ? 'text-crimson' : 'text-ink-muted hover:text-crimson'}`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-crimson' : ''}`} />
                      <span className="text-xs">{likeCount}</span>
                    </button>
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className={`flex items-center gap-1 transition-colors ${
                        showComments ? 'text-crimson' : 'text-ink-muted hover:text-ink-white'
                      }`}
                    >
                      <MessageSquare className={`w-4 h-4 ${showComments ? 'fill-crimson/20' : ''}`} />
                      <span className="text-xs">{workComments.length}</span>
                    </button>
                    <button className="flex items-center gap-1 text-ink-muted hover:text-ink-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-ink-muted" />
                    <span className="text-xs text-ink-muted">{currentPage + 1} / {SAMPLE_PAGES.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
