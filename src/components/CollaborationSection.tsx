import { motion } from 'framer-motion';
import { Users, Pen, Palette, Code, Music, Globe } from 'lucide-react';

const COLLAB_ROLES = [
  { icon: <Pen className="w-5 h-5" />, title: 'Scénaristes', color: 'text-crimson', bg: 'bg-crimson/10' },
  { icon: <Palette className="w-5 h-5" />, title: 'Dessinateurs', color: 'text-gold', bg: 'bg-gold/10' },
  { icon: <Code className="w-5 h-5" />, title: 'Coloristes', color: 'text-eumene', bg: 'bg-eumene/10' },
  { icon: <Music className="w-5 h-5" />, title: 'Letterers', color: 'text-premium', bg: 'bg-premium/10' },
  { icon: <Globe className="w-5 h-5" />, title: 'Traducteurs', color: 'text-crimson', bg: 'bg-crimson/10' },
];

export default function CollaborationSection() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-premium/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-premium" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink-white">Espace Collaboration</h2>
            <p className="text-sm text-ink-muted">Trouvez votre équipe de création</p>
          </div>
        </div>

        {/* Roles */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          {COLLAB_ROLES.map((role, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0 p-4 bg-ink-card rounded-xl border border-ink-border/30 hover:border-ink-border/60 transition-all cursor-pointer min-w-[140px]"
            >
              <div className={`w-10 h-10 rounded-lg ${role.bg} ${role.color} flex items-center justify-center mb-2`}>{role.icon}</div>
              <p className="text-sm font-semibold text-ink-white">{role.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
