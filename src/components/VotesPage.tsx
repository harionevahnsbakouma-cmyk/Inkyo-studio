import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Trophy, Calendar, Flame, Star, Eye, Crown, Check, ArrowUp, BookOpen, Printer, ChevronRight, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WORKS, GENRES } from '../data/works';

export default function VotesPage() {
  const { votedWorks, voteForWork, isAuthenticated, setShowAuthModal, setCurrentWork, setShowReader } = useStore();
  const [genre, setGenre] = useState('Tout');
  const [showInfo, setShowInfo] = useState(true);

  const sortedByVotes = useMemo(() => {
    const filtered = genre === 'Tout' ? [...WORKS] : WORKS.filter(w => w.genre === genre);
    return filtered.sort((a, b) => {
      const aVotes = votedWorks.has(a.id) ? a.votes + 1 : a.votes;
      const bVotes = votedWorks.has(b.id) ? b.votes + 1 : b.votes;
      return bVotes - aVotes;
    });
  }, [genre, votedWorks]);

  const handleVote = (workId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    voteForWork(workId);
  };

  const handleRead = (work: typeof WORKS[0]) => {
    setCurrentWork(work);
    setShowReader(true);
  };

  const totalVotes = WORKS.reduce((sum, w) => sum + w.votes, 0) + votedWorks.size;
  const topWork = sortedByVotes[0];
  const maxVotes = topWork ? (votedWorks.has(topWork.id) ? topWork.votes + 1 : topWork.votes) : 1;

  return (
    <div className="pt-20 pb-24 md:pb-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-8 bg-linear-to-br from-gold/10 via-ink-card to-crimson/10 border border-gold/20"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(244,162,97,0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(230,57,70,0.2),transparent_50%)]" />
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Vote className="w-5 h-5 text-gold" />
                  </div>
                  <span className="px-2.5 py-1 bg-crimson/15 border border-crimson/30 rounded-full text-[11px] text-crimson font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Votes ouverts
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-ink-white mb-1">Votez pour l'édition papier</h1>
                <p className="text-sm text-ink-muted max-w-lg">
                  Choisissez les webtoons qui méritent d'être imprimés. Les œuvres les plus votées seront éditées en version papier.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span className="text-xs text-gold font-semibold">Publication fin 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-eumene" />
                    <span className="text-xs text-eumene font-semibold">Top 5 imprimés</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex sm:flex-col gap-3 sm:gap-2">
                <div className="flex-1 sm:flex-none p-3 bg-ink-black/40 rounded-xl text-center border border-ink-border/20">
                  <p className="text-xl sm:text-2xl font-black text-gold">{(totalVotes).toLocaleString()}</p>
                  <p className="text-[10px] text-ink-muted">votes totaux</p>
                </div>
                <div className="flex-1 sm:flex-none p-3 bg-ink-black/40 rounded-xl text-center border border-ink-border/20">
                  <p className="text-xl sm:text-2xl font-black text-crimson">{WORKS.length}</p>
                  <p className="text-[10px] text-ink-muted">webtoons en lice</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info banner */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-ink-card rounded-xl border border-ink-border/30 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-eumene shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-ink-text font-medium">Comment ça marche ?</p>
                  <p className="text-xs text-ink-muted mt-1">
                    Lisez les webtoons, puis votez pour vos favoris. Chaque utilisateur peut voter pour autant d'œuvres qu'il le souhaite. Le top 5 sera imprimé en édition collector.
                  </p>
                </div>
                <button onClick={() => setShowInfo(false)} className="text-ink-muted hover:text-ink-text text-xs shrink-0">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Genre filter */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar mb-6">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                genre === g
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'bg-ink-dark/60 text-ink-muted hover:text-ink-text border border-transparent'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* === VOTING LIST === */}
        <div className="space-y-3">
          {sortedByVotes.map((work, i) => {
            const hasVoted = votedWorks.has(work.id);
            const voteCount = hasVoted ? work.votes + 1 : work.votes;
            const pct = (voteCount / maxVotes) * 100;
            const rank = i + 1;
            const inTop5 = rank <= 5;

            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border overflow-hidden group transition-all ${
                  inTop5
                    ? 'bg-ink-card border-gold/15 hover:border-gold/30'
                    : 'bg-ink-card/60 border-ink-border/20 hover:border-ink-border/40'
                }`}
              >
                {/* Progress background */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className={`h-full transition-all duration-700 ${
                      rank === 1 ? 'bg-gold/8' : inTop5 ? 'bg-crimson/5' : 'bg-ink-border/5'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Rank */}
                <div className={`relative shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black ${
                  rank === 1 ? 'bg-linear-to-br from-yellow-400 to-amber-600 text-white shadow-md shadow-gold/20'
                    : rank === 2 ? 'bg-linear-to-br from-slate-300 to-slate-500 text-white'
                    : rank === 3 ? 'bg-linear-to-br from-orange-400 to-orange-700 text-white'
                    : inTop5 ? 'bg-gold/10 text-gold'
                    : 'bg-ink-dark text-ink-muted'
                }`}>
                  {rank <= 3 ? <Trophy className="w-4 h-4" /> : rank}
                </div>

                {/* Cover */}
                <div
                  onClick={() => handleRead(work)}
                  className="relative w-11 h-15 sm:w-12 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-ink-border/20 cursor-pointer"
                >
                  <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3
                      onClick={() => handleRead(work)}
                      className="text-sm font-semibold text-ink-white truncate cursor-pointer hover:text-crimson transition-colors"
                    >
                      {work.title}
                    </h3>
                    {work.isPremium && <Crown className="w-3.5 h-3.5 text-premium shrink-0" />}
                  </div>
                  <p className="text-xs text-ink-muted">{work.author} · {work.genre} · {work.episodes} ép.</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-[11px] text-gold">
                      <Star className="w-3 h-3 fill-gold" /> {work.rating}
                    </span>
                    <span className="flex items-center gap-0.5 text-[11px] text-ink-muted">
                      <Eye className="w-3 h-3" /> {work.views}
                    </span>
                    {inTop5 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-eumene font-semibold">
                        <Printer className="w-3 h-3" /> Éligible
                      </span>
                    )}
                  </div>
                </div>

                {/* Vote area */}
                <div className="relative flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-ink-white">{voteCount.toLocaleString()}</p>
                    <p className="text-[10px] text-ink-muted">votes</p>
                  </div>
                  <button
                    onClick={() => handleVote(work.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      hasVoted
                        ? 'bg-gold text-ink-black shadow-md shadow-gold/20'
                        : 'bg-ink-dark border border-ink-border/50 text-ink-text hover:border-gold/50 hover:text-gold hover:bg-gold/5'
                    }`}
                  >
                    {hasVoted ? (
                      <><Check className="w-4 h-4" /> Voté</>
                    ) : (
                      <><ArrowUp className="w-4 h-4" /> Voter</>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-ink-muted mb-3">Vous êtes créateur ? Publiez votre webtoon pour participer au vote.</p>
          <button
            onClick={() => {
              if (!isAuthenticated) setShowAuthModal(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-crimson/20"
          >
            Publier mon webtoon <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
