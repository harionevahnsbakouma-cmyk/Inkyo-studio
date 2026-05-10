import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Eye, Flame, Crown, TrendingUp, ArrowUpRight, Filter, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WORKS, GENRES } from '../data/works';

type SortKey = 'views' | 'rating' | 'votes' | 'episodes';

const SORT_OPTIONS: { key: SortKey; label: string; icon: React.ReactNode }[] = [
  { key: 'views', label: 'Vues', icon: <Eye className="w-3.5 h-3.5" /> },
  { key: 'rating', label: 'Note', icon: <Star className="w-3.5 h-3.5" /> },
  { key: 'votes', label: 'Votes', icon: <Flame className="w-3.5 h-3.5" /> },
  { key: 'episodes', label: 'Épisodes', icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

function parseViews(v: string): number {
  if (v.includes('M')) return parseFloat(v) * 1_000_000;
  if (v.includes('K')) return parseFloat(v) * 1_000;
  return parseInt(v);
}

export default function ClassementPage() {
  const { setCurrentWork, setShowReader } = useStore();
  const [sortBy, setSortBy] = useState<SortKey>('views');
  const [genre, setGenre] = useState('Tout');

  const sorted = useMemo(() => {
    let filtered = genre === 'Tout' ? [...WORKS] : WORKS.filter(w => w.genre === genre);
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views': return parseViews(b.views) - parseViews(a.views);
        case 'rating': return b.rating - a.rating;
        case 'votes': return b.votes - a.votes;
        case 'episodes': return b.episodes - a.episodes;
        default: return 0;
      }
    });
    return filtered;
  }, [sortBy, genre]);

  const handleRead = (work: typeof WORKS[0]) => {
    setCurrentWork(work);
    setShowReader(true);
  };

  const getMedalColor = (i: number) => {
    if (i === 0) return 'from-yellow-400 to-amber-600';
    if (i === 1) return 'from-slate-300 to-slate-500';
    if (i === 2) return 'from-orange-400 to-orange-700';
    return '';
  };

  return (
    <div className="pt-20 pb-24 md:pb-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink-white">Classement</h1>
              <p className="text-sm text-ink-muted">Les meilleurs webtoons de la communauté Inkyo</p>
            </div>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Sort buttons */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  sortBy === opt.key
                    ? 'bg-crimson text-white shadow-md shadow-crimson/20'
                    : 'bg-ink-card border border-ink-border/30 text-ink-muted hover:text-ink-text hover:border-ink-border/60'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>

          {/* Genre filter */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar sm:ml-auto">
            {GENRES.slice(0, 6).map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  genre === g
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'bg-ink-dark/60 text-ink-muted hover:text-ink-text border border-transparent'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>

        {/* === TOP 3 PODIUM === */}
        {sorted.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[1, 0, 2].map((rank) => {
              const work = sorted[rank];
              if (!work) return null;
              const isFirst = rank === 0;
              return (
                <motion.div
                  key={work.id}
                  whileHover={{ y: -4 }}
                  onClick={() => handleRead(work)}
                  className={`relative cursor-pointer group ${
                    isFirst ? 'sm:-mt-4 order-2 sm:order-0' : rank === 1 ? 'order-1 sm:order-0' : 'order-3 sm:order-0'
                  }`}
                >
                  {/* Cover */}
                  <div className={`relative aspect-3/4 rounded-xl overflow-hidden mb-2 border-2 transition-all ${
                    isFirst ? 'border-gold/50 shadow-lg shadow-gold/10' : 'border-ink-border/30 group-hover:border-ink-border/60'
                  }`}>
                    <img src={work.cover} alt={work.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                    {/* Medal */}
                    <div className={`absolute top-2 left-2 w-8 h-8 rounded-full bg-linear-to-br ${getMedalColor(rank)} flex items-center justify-center shadow-lg`}>
                      <span className="text-xs font-black text-white">{rank + 1}</span>
                    </div>

                    {/* Play on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-crimson/90 flex items-center justify-center shadow-xl">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Stats overlay */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-gold font-semibold">
                          <Star className="w-2.5 h-2.5 fill-gold" /> {work.rating}
                        </span>
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-ink-text">
                          <Eye className="w-2.5 h-2.5" /> {work.views}
                        </span>
                      </div>
                    </div>

                    {work.isPremium && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-premium/90 rounded text-[9px] font-bold text-white flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> PRO
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-ink-white truncate group-hover:text-crimson transition-colors">{work.title}</h3>
                  <p className="text-[11px] text-ink-muted truncate">{work.author}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* === FULL LIST === */}
        <div className="space-y-2">
          {sorted.map((work, i) => {
            const rank = i + 1;
            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
                onClick={() => handleRead(work)}
                className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-ink-card/70 rounded-xl border border-ink-border/20 overflow-hidden group cursor-pointer hover:border-ink-border/50 hover:bg-ink-card transition-all"
              >
                {/* Rank */}
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                  rank <= 3
                    ? `bg-linear-to-br ${getMedalColor(i)} text-white shadow-sm`
                    : 'bg-ink-dark text-ink-muted'
                }`}>
                  {rank}
                </div>

                {/* Cover */}
                <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-ink-border/20">
                  <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-ink-white truncate group-hover:text-crimson transition-colors">{work.title}</h3>
                  <p className="text-xs text-ink-muted">{work.author} · {work.genre}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-0.5 text-[11px] text-gold">
                      <Star className="w-3 h-3 fill-gold" /> {work.rating}
                    </span>
                    <span className="flex items-center gap-0.5 text-[11px] text-ink-muted">
                      <Eye className="w-3 h-3" /> {work.views}
                    </span>
                    <span className="flex items-center gap-0.5 text-[11px] text-ink-muted">
                      {work.episodes} ép.
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0">
                  {work.isTrending && (
                    <span className="hidden sm:flex items-center gap-0.5 px-2 py-1 bg-crimson/10 border border-crimson/20 rounded-full text-[10px] text-crimson font-semibold">
                      <Flame className="w-3 h-3" /> Hot
                    </span>
                  )}
                  {work.isPremium && (
                    <span className="hidden sm:flex items-center gap-0.5 px-2 py-1 bg-premium/10 border border-premium/20 rounded-full text-[10px] text-premium font-semibold">
                      <Crown className="w-3 h-3" /> Pro
                    </span>
                  )}
                  <div className="w-7 h-7 rounded-lg bg-ink-dark flex items-center justify-center text-ink-muted group-hover:text-crimson group-hover:bg-crimson/10 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-20">
            <Filter className="w-10 h-10 text-ink-muted mx-auto mb-3" />
            <p className="text-ink-muted">Aucun webtoon trouvé pour ces filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
}
