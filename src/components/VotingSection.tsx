import { motion } from 'framer-motion';
import { Vote, Trophy, Calendar, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WORKS } from '../data/works';

export default function VotingSection() {
  const { votedWorks, voteForWork, isAuthenticated, setShowAuthModal } = useStore();

  const sortedByVotes = [...WORKS].sort((a, b) => b.votes - a.votes).slice(0, 5);

  const handleVote = (workId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    voteForWork(workId);
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-white">Vote pour l'édition papier</h2>
              <p className="text-sm text-ink-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Publication prévue fin 2026
              </p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-crimson/10 border border-crimson/30 rounded-full text-xs text-crimson font-semibold">
            <Flame className="w-3.5 h-3.5" /> En cours
          </span>
        </div>

        {/* Voting Cards */}
        <div className="space-y-3">
          {sortedByVotes.map((work, i) => {
            const hasVoted = votedWorks.has(work.id);
            const voteCount = hasVoted ? work.votes + 1 : work.votes;
            const maxVotes = sortedByVotes[0].votes;
            const pct = (voteCount / maxVotes) * 100;

            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative flex items-center gap-4 p-3 sm:p-4 bg-ink-card rounded-xl border border-ink-border/30 overflow-hidden group hover:border-ink-border/60 transition-all"
              >
                {/* Progress bg */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`h-full ${i === 0 ? 'bg-gold' : 'bg-crimson'} transition-all`} style={{ width: `${pct}%` }} />
                </div>

                {/* Rank */}
                <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                  i === 0 ? 'bg-gold/20 text-gold' : i === 1 ? 'bg-ink-border/30 text-ink-text' : 'bg-ink-dark text-ink-muted'
                }`}>
                  {i + 1}
                </div>

                {/* Cover */}
                <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0">
                  <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="relative flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-ink-white truncate">{work.title}</h3>
                  <p className="text-xs text-ink-muted">{work.author} • {work.genre}</p>
                </div>

                {/* Votes */}
                <div className="relative flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-ink-white">{voteCount.toLocaleString()}</p>
                    <p className="text-[10px] text-ink-muted">votes</p>
                  </div>
                  <button
                    onClick={() => handleVote(work.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      hasVoted
                        ? 'bg-gold text-ink-black'
                        : 'bg-ink-dark border border-ink-border/50 text-ink-text hover:border-gold/50 hover:text-gold'
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" />
                    {hasVoted ? 'Voté ✓' : 'Voter'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
