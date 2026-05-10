import { motion } from 'framer-motion';
import { PenLine, BookOpen, Vote } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function HeroSection() {
  const { isAuthenticated, setShowAuthModal, setShowPublishModal, setActivePage } = useStore();

  const handlePublish = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowPublishModal(true);
    }
  };

  return (
    <section className="relative min-h-[85svh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-ink-black via-ink-black/70 to-ink-black/40" />
        <div className="absolute inset-0 bg-linear-to-r from-ink-black/80 via-transparent to-ink-black/60" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 w-full py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <img src="/images/inkyo-logo.png" alt="Inkyo" className="h-14 sm:h-16 w-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-ink-white leading-tight mb-4"
            style={{ fontFamily: 'var(--font-jp)' }}
          >
            Publiez, lisez et <br />
            <span className="text-gradient-crimson">votez</span> pour vos webtoons
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-ink-text/70 text-base sm:text-lg mb-8 max-w-lg leading-relaxed"
          >
            La plateforme communautaire de manga et webtoon indépendant.
            Créez, partagez et faites vivre vos histoires.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-3.5 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-crimson/30 hover:scale-105 active:scale-95"
            >
              <PenLine className="w-5 h-5" />
              Publier mon webtoon
            </button>

            <button
              onClick={() => setActivePage('classement')}
              className="flex items-center gap-2 px-6 py-3.5 bg-ink-card/80 border border-ink-border/50 text-ink-white font-semibold rounded-xl hover:bg-ink-card transition-all hover:border-ink-border"
            >
              <BookOpen className="w-5 h-5" />
              Découvrir
            </button>

            <button
              onClick={() => setActivePage('votes')}
              className="flex items-center gap-2 px-6 py-3.5 bg-ink-card/80 border border-ink-border/50 text-ink-white font-semibold rounded-xl hover:bg-ink-card transition-all hover:border-gold/50 group"
            >
              <Vote className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              Voter
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-ink-muted/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-ink-muted/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
