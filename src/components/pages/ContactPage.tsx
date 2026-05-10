import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="pt-20 pb-24 md:pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-crimson/15 flex items-center justify-center">
              <Mail className="w-6 h-6 text-crimson" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink-white">Contact</h1>
              <p className="text-sm text-ink-muted">Une question ? Écrivez-nous</p>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'contact@inkyo.app', color: 'text-crimson', bg: 'bg-crimson/10' },
            { icon: <MapPin className="w-5 h-5" />, label: 'Localisation', value: 'International', color: 'text-eumene', bg: 'bg-eumene/10' },
            { icon: <MessageSquare className="w-5 h-5" />, label: 'Réponse', value: 'Sous 48h', color: 'text-gold', bg: 'bg-gold/10' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-ink-card rounded-xl border border-ink-border/20 text-center"
            >
              <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mx-auto mb-2`}>{item.icon}</div>
              <p className="text-xs text-ink-muted">{item.label}</p>
              <p className="text-sm font-semibold text-ink-white">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 bg-ink-card rounded-2xl border border-ink-border/20 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-ink-text mb-1 block">Nom</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Votre nom"
                className="w-full bg-ink-dark border border-ink-border/30 rounded-xl px-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-text mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full bg-ink-dark border border-ink-border/30 rounded-xl px-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-text mb-1 block">Sujet</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              placeholder="De quoi s'agit-il ?"
              className="w-full bg-ink-dark border border-ink-border/30 rounded-xl px-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-text mb-1 block">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Décrivez votre demande en détail..."
              className="w-full bg-ink-dark border border-ink-border/30 rounded-xl px-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 resize-none"
            />
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 bg-eumene/10 border border-eumene/30 rounded-xl"
            >
              <CheckCircle2 className="w-5 h-5 text-eumene" />
              <p className="text-sm text-eumene font-medium">Message envoyé ! Nous vous répondrons sous 48h.</p>
            </motion.div>
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-crimson/20 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" /> Envoyer le message
            </button>
          )}
        </motion.form>
      </div>
    </div>
  );
}
