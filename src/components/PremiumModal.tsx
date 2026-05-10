import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap, BookOpen, Shield, Palette, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function PremiumModal() {
  const { showPremiumModal, setShowPremiumModal } = useStore();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [payMethod, setPayMethod] = useState<'paypal' | 'mtn'>('paypal');
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    setLoading(true);
    try {
      console.log(`Initialisation paiement: ${plan} via ${payMethod}`);
      
      // Ici, tu appelleras ta Firebase Function
      // Exemple : const response = await fetch('/api/create-payment', { method: 'POST', ... });
      
      // Simulation d'un délai réseau (à supprimer quand tu auras ton API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Paiement ${payMethod} prêt pour le plan ${plan} !`);
    } catch (error) {
      console.error("Erreur paiement:", error);
      alert("Une erreur est survenue lors de l'initialisation.");
    } finally {
      setLoading(false);
    }
  };

  if (!showPremiumModal) return null;

  const features = [
    { icon: <BookOpen className="w-4 h-4" />, text: 'Lecture illimitée sans publicité' },
    { icon: <Zap className="w-4 h-4" />, text: 'Accès anticipé aux nouveaux épisodes' },
    { icon: <Crown className="w-4 h-4" />, text: 'Badge VIP exclusif' },
    { icon: <Shield className="w-4 h-4" />, text: 'Soutien direct aux créateurs (15%)' },
    { icon: <Palette className="w-4 h-4" />, text: 'Accès au catalogue Eumène' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z - 100 flex items-center justify-center p-4"
        onClick={() => setShowPremiumModal(false)}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-ink-card shadow-2xl"
        >
          <div className="bg-linear-to-br from-premium-dark via-premium to-crimson p-6 text-center">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <Crown className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-black text-white">Inkyo Premium</h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex bg-ink-dark rounded-xl p-1">
              <button onClick={() => setPlan('monthly')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${plan === 'monthly' ? 'bg-premium text-white' : 'text-ink-muted'}`}>Mensuel</button>
              <button onClick={() => setPlan('yearly')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${plan === 'yearly' ? 'bg-premium text-white' : 'text-ink-muted'}`}>
                Annuel
                <span className="absolute -top-2 -right-1 px-1.5 py-0.5 bg-gold text-ink-black text-[9px] font-bold rounded-full">-40%</span>
              </button>
            </div>

            <div className="text-center">
              <div className="text-4xl font-black text-ink-white">{plan === 'monthly' ? '4.99€' : '2.99€'}<span className="text-sm font-normal text-ink-muted">/mois</span></div>
              {plan === 'yearly' && <p className="text-xs text-gold mt-1">Facturé 35.88€/an</p>}
            </div>

            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-premium/10 flex items-center justify-center text-premium">{f.icon}</div>
                  <span className="text-sm text-ink-text">{f.text}</span>
                  <Check className="w-4 h-4 text-eumene ml-auto" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPayMethod('paypal')} className={`p-3 rounded-xl border text-center transition-all ${payMethod === 'paypal' ? 'border-premium bg-premium/10' : 'border-ink-border/30 bg-ink-dark'}`}>
                <span className="text-lg">💳</span><p className="text-xs font-semibold text-ink-text mt-1">PayPal</p>
              </button>
              <button onClick={() => setPayMethod('mtn')} className={`p-3 rounded-xl border text-center transition-all ${payMethod === 'mtn' ? 'border-premium bg-premium/10' : 'border-ink-border/30 bg-ink-dark'}`}>
                <span className="text-lg">📱</span><p className="text-xs font-semibold text-ink-text mt-1">MTN MoMo</p>
              </button>
            </div>

            <button 
              disabled={loading}
              onClick={handleSubscription}
              className="w-full py-4 bg-linear-to-r from-premium-dark to-premium text-white font-bold rounded-xl hover:shadow-xl hover:shadow-premium/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                "S'abonner maintenant"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}