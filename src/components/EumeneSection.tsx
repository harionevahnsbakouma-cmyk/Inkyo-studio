import { motion } from 'framer-motion';
import { ShoppingBag, Palette, Truck } from 'lucide-react';
// import { useStore } from '../store/useStore';

export default function EumeneSection() {
  // const { mode } = useStore();
  
  // if (mode !== 'eumene') return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-10 bg-linear-to-br from-eumene/10 via-ink-card to-ink-dark border border-eumene/20"
        >
          <div className="p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gradient-eumene mb-3">Eumène</h2>
            <p className="text-ink-text text-sm sm:text-base max-w-md mb-4">
              Le catalogue professionnel Inkyo. Art-books, éditions papier et produits dérivés en Print-on-Demand.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-eumene"><Truck className="w-3.5 h-3.5" /> Livraison mondiale</span>
              <span className="flex items-center gap-1.5 text-xs text-eumene"><Palette className="w-3.5 h-3.5" /> Print-on-Demand</span>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
          {['Tout', 'Art-books', 'Éditions papier', 'Posters', 'Coffrets'].map((cat, i) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              i === 0 ? 'bg-eumene text-white' : 'bg-ink-card border border-ink-border/30 text-ink-muted hover:text-ink-text hover:border-eumene/50'
            }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-eumene/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-eumene" />
          </div>
          <p className="text-lg font-semibold text-ink-white">Bientôt disponible</p>
          <p className="text-sm text-ink-muted mt-1 max-w-sm mx-auto">
            Le catalogue Eumène ouvrira prochainement. Les art-books et éditions papier des œuvres les plus votées y seront disponibles.
          </p>
        </div>
      </div>
    </section>
  );
}
