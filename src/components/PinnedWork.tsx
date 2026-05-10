import { motion } from 'framer-motion';
import { Pin, Play, Vote, Star, Eye, Crown, Trophy, Flame, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Work, Comment } from '../store/useStore';
import { WORKS } from '../data/works';

function getVoteCount(work: Work, votedWorks: Set<string>): number {
  return work.votes + (votedWorks.has(work.id) ? 1 : 0);
}

export default function PinnedWork() {
  const {
    votedWorks, voteForWork, isAuthenticated, setShowAuthModal,
    setCurrentWork, setShowReader, comments,
  } = useStore();

  // Find the work with the most votes
  if (WORKS.length === 0) return null;

  let topWork: Work | null = null;
  let topVotes = 0;

  for (const work of WORKS) {
    const v = getVoteCount(work, votedWorks);
    if (v > topVotes) {
      topVotes = v;
      topWork = work;
    }
  }

  // Only show if at least 1 vote exists
  if (!topWork || topVotes === 0) return null;

  const workComments = comments.filter((c: Comment) => c.workId === topWork!.id);
  const hasVoted = votedWorks.has(topWork.id);

  const handleRead = () => {
    setCurrentWork(topWork);
    setShowReader(true);
  };

  const handleVote = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    voteForWork(topWork!.id);
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden border border-gold/20 bg-linear-to-br from-gold/5 via-ink-card to-crimson/5"
        >
          {/* Pin badge */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gold text-ink-black text-xs font-black rounded-b-xl shadow-lg shadow-gold/30"
              >
                <Pin className="w-3.5 h-3.5" />
                ÉPINGLÉ — WEBTOON LE PLUS VOTÉ
                <Trophy className="w-3.5 h-3.5" />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-6 pt-10 sm:pt-12">
            {/* Cover */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={handleRead}
              className="shrink-0 w-full sm:w-44 aspect-3/4 sm:aspect-auto sm:h-60 rounded-xl overflow-hidden cursor-pointer relative group"
            >
              <img
                src={topWork.cover}
                alt={topWork.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-crimson/90 flex items-center justify-center shadow-xl shadow-crimson/40">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Rank badge on cover */}
              <div className="absolute top-2 left-2 w-9 h-9 rounded-lg bg-linear-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Trophy className="w-4 h-4 text-white" />
              </div>

              {topWork.isPremium && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-premium/90 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" /> PRO
                </span>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {topWork.isTrending && (
                  <span className="px-2 py-0.5 bg-crimson/15 border border-crimson/30 rounded-full text-[10px] text-crimson font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Trending
                  </span>
                )}
                {topWork.genre && (
                  <span className="px-2 py-0.5 bg-ink-dark border border-ink-border/30 rounded-full text-[10px] text-ink-muted font-medium">
                    {topWork.genre}
                  </span>
                )}
                {topWork.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-ink-dark border border-ink-border/30 rounded-full text-[10px] text-ink-muted font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <h2
                onClick={handleRead}
                className="text-xl sm:text-2xl font-black text-ink-white mb-1 cursor-pointer hover:text-crimson transition-colors"
                style={{ fontFamily: 'var(--font-jp)' }}
              >
                {topWork.title}
              </h2>

              <p className="text-sm text-ink-muted mb-1">
                Par <span className="text-ink-text font-medium">{topWork.author}</span>
              </p>

              <p className="text-sm text-ink-text/60 mb-4 line-clamp-2">{topWork.description}</p>

              {/* Stats row */}
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-gold/15 flex items-center justify-center">
                    <Vote className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gold">{topVotes.toLocaleString()}</p>
                    <p className="text-[9px] text-ink-muted leading-none">votes</p>
                  </div>
                </div>

                {topWork.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-gold/15 flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-white">{topWork.rating}</p>
                      <p className="text-[9px] text-ink-muted leading-none">note</p>
                    </div>
                  </div>
                )}

                {topWork.episodes > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-ink-dark flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 text-ink-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-white">{topWork.episodes}</p>
                      <p className="text-[9px] text-ink-muted leading-none">épisodes</p>
                    </div>
                  </div>
                )}

                {workComments.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-ink-dark flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5 text-ink-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-white">{workComments.length}</p>
                      <p className="text-[9px] text-ink-muted leading-none">messages</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleRead}
                  className="flex items-center gap-2 px-5 py-2.5 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-crimson/30 active:scale-95 text-sm"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Lire
                </button>

                <button
                  onClick={handleVote}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    hasVoted
                      ? 'bg-gold text-ink-black shadow-md shadow-gold/20'
                      : 'bg-ink-dark border border-ink-border/50 text-ink-text hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  {hasVoted ? 'Voté ✓' : 'Voter'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
