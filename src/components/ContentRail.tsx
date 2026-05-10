import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Play, Crown, Flame, Sparkles, MessageSquare } from 'lucide-react';
import type { Work, Comment } from '../store/useStore';
import { useStore } from '../store/useStore';

interface ContentRailProps {
  title: string;
  works: Work[];
  icon?: React.ReactNode;
  accent?: string;
}

export default function ContentRail({ title, works, icon, }: ContentRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setCurrentWork, setShowReader, comments } = useStore();

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleClick = (work: Work) => {
    setCurrentWork(work);
    setShowReader(true);
  };

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg sm:text-xl font-bold text-ink-white">{title}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => scroll('left')} className="p-1.5 rounded-lg bg-ink-card border border-ink-border/30 text-ink-muted hover:text-ink-white hover:border-ink-border transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} className="p-1.5 rounded-lg bg-ink-card border border-ink-border/30 text-ink-muted hover:text-ink-white hover:border-ink-border transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Rail */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-2">
          {works.map((work, i) => (
            <motion.div
              key={work.id + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0 w-40 sm:w-45 group cursor-pointer"
              onClick={() => handleClick(work)}
            >
              {/* Cover */}
              <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-2">
                <img
                  src={work.cover}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover Play */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-crimson/90 flex items-center justify-center shadow-xl shadow-crimson/30">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {work.isPremium && (
                    <span className="px-1.5 py-0.5 bg-premium/90 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}
                  {work.isNew && (
                    <span className="px-1.5 py-0.5 bg-eumene/90 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> NEW
                    </span>
                  )}
                  {work.isTrending && (
                    <span className="px-1.5 py-0.5 bg-crimson/90 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> HOT
                    </span>
                  )}
                </div>

                {/* Rating + Comments */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  {comments.filter((c: Comment) => c.workId === work.id).length > 0 && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-ink-text font-semibold">
                      <MessageSquare className="w-2.5 h-2.5" /> {comments.filter((c: Comment) => c.workId === work.id).length}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-gold font-semibold">
                    <Star className="w-2.5 h-2.5 fill-gold" /> {work.rating}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-sm font-semibold text-ink-white truncate group-hover:text-crimson transition-colors">{work.title}</h3>
              <p className="text-xs text-ink-muted truncate">{work.author}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-ink-muted">{work.episodes} ép.</span>
                <span className="text-[10px] text-ink-muted">·</span>
                <span className="text-[10px] text-ink-muted">{work.views}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
