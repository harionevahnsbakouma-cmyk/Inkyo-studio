import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';

// ─── Knowledge base ───
interface KBEntry {
  keywords: string[];
  answer: string;
}

const KNOWLEDGE_BASE: KBEntry[] = [
  // Général
  { keywords: ['bonjour', 'salut', 'hello', 'hey', 'coucou', 'bonsoir'], answer: 'Bonjour ! 👋 Je suis InkyBot, l\'assistant intelligent d\'Inkyo. Comment puis-je vous aider aujourd\'hui ?' },
  { keywords: ['merci', 'thanks', 'super', 'parfait', 'génial', 'cool'], answer: 'Avec plaisir ! 😊 N\'hésitez pas si vous avez d\'autres questions.' },
  { keywords: ['qui es-tu', 'tu es qui', 'c\'est quoi inkybot', 'bot'], answer: 'Je suis InkyBot 🤖, l\'assistant virtuel d\'Inkyo. Je connais tout sur la plateforme et je peux vous guider pour publier, lire, voter et bien plus !' },
  { keywords: ['inkyo', 'c\'est quoi', 'plateforme', 'à propos', 'présentation'], answer: 'Inkyo est une plateforme hybride de manga et webtoon indépendant 📚. Elle combine la lecture (comme Netflix), le côté communautaire (comme TikTok) et la création (comme Mangadraft). Vous pouvez publier vos webtoons, les faire lire, et les plus votés seront imprimés en édition papier !' },

  // Publication
  { keywords: ['publier', 'publication', 'poster', 'upload', 'importer', 'comment publier'], answer: 'Pour publier votre webtoon :\n\n1️⃣ Cliquez sur le bouton rouge **"Publier"** dans la navbar\n2️⃣ Remplissez le titre, description, genre et tags\n3️⃣ Importez vos images depuis votre appareil (couverture + pages)\n4️⃣ Cliquez sur Publier !\n\n💡 Activez le **Bulk Upload** pour importer plus de 1000 épisodes d\'un coup.' },
  { keywords: ['bulk upload', 'bulk', '1000', 'masse', 'beaucoup d\'épisodes', 'plusieurs épisodes'], answer: 'Le **Bulk Upload** vous permet d\'importer des séries de plus de 1000 épisodes en une seule fois 🚀. Activez-le dans l\'écran de publication (étape 2). Sélectionnez toutes vos images depuis votre galerie, elles seront triées automatiquement par nom.' },
  { keywords: ['format', 'image', 'taille', 'png', 'jpg', 'webp', 'résolution'], answer: 'Inkyo accepte les formats **PNG, JPG et WebP** 🖼️. Pour une qualité optimale, nous recommandons une largeur de 800px minimum. Le ratio 3:4 est idéal pour les couvertures.' },
  { keywords: ['couverture', 'cover'], answer: 'La couverture est la première image que les lecteurs voient. Importez-la à l\'étape 2 de la publication. Format recommandé : **ratio 3:4**, PNG ou JPG, au moins 800px de large.' },

  // Lecture
  { keywords: ['lire', 'lecture', 'liseuse', 'reader', 'comment lire'], answer: 'Pour lire un webtoon, cliquez sur sa couverture ou sur le bouton **"Lire"** 📖. La liseuse offre deux modes :\n\n📜 **Scroll vertical** — défilez vers le bas\n👆 **Tap horizontal** — tapez à droite/gauche pour tourner les pages\n\nChangez de mode avec l\'icône en haut à droite de la liseuse.' },
  { keywords: ['scroll', 'vertical', 'horizontal', 'mode lecture', 'changer mode'], answer: 'La liseuse propose 2 modes :\n\n📜 **Scroll vertical** : défilement continu, idéal pour les webtoons\n👆 **Tap horizontal** : navigation page par page, style manga\n\nCliquez sur l\'icône ↔️ en haut à droite de la liseuse pour basculer.' },
  { keywords: ['plein écran', 'fullscreen', 'écran complet'], answer: 'Cliquez sur l\'icône ⛶ en haut à droite de la liseuse pour passer en plein écran. Recliquez pour revenir au mode normal.' },

  // Votes
  { keywords: ['vote', 'voter', 'votes', 'comment voter', 'système de vote'], answer: 'Le système de votes est au cœur d\'Inkyo ! 🗳️\n\n• Allez sur la page **"Votes"** dans la navbar\n• Cliquez sur **"Voter"** à côté du webtoon de votre choix\n• Vous pouvez voter pour autant d\'œuvres que vous voulez\n• Le **top 5** sera imprimé en édition papier fin 2026 📕\n• Le webtoon #1 est **épinglé** en haut de l\'accueil !' },
  { keywords: ['épinglé', 'pinned', 'accueil', 'mis en avant', 'top vote'], answer: 'Le webtoon avec le plus de votes est automatiquement **épinglé** en haut de la page d\'accueil 📌 avec une bannière dorée. C\'est dynamique : si un autre webtoon prend la tête, il remplace l\'épinglé !' },
  { keywords: ['édition papier', 'impression', 'imprimer', 'papier', '2026'], answer: 'Les 5 webtoons les plus votés seront édités en **version papier collector** fin 2026 📕. Les auteurs sélectionnés signeront un contrat d\'édition. Votez pour vos favoris sur la page Votes !' },

  // Premium
  { keywords: ['premium', 'abonnement', 'vip', 'payant', 'prix', 'combien'], answer: 'L\'abonnement **Inkyo Premium** 👑 offre :\n\n✅ Lecture sans publicité\n✅ Accès anticipé aux nouveaux épisodes\n✅ Badge VIP exclusif\n✅ Soutien direct aux créateurs (15%)\n\n💰 **2.99€/mois** (annuel) ou **4.99€/mois** (mensuel)\n\nCliquez sur votre profil → Premium pour vous abonner.' },
  { keywords: ['pub', 'publicité', 'pub vidéo', 'ads', 'sans pub'], answer: 'Le contenu gratuit est soutenu par des **publicités vidéo** de 5 secondes avant la lecture 📺. Passez à **Premium** (2.99€/mois) pour une lecture 100% sans pub !' },

  // Paiement
  { keywords: ['paiement', 'payer', 'paypal', 'mtn', 'mobile money', 'argent'], answer: 'Inkyo accepte deux modes de paiement 💳 :\n\n• **PayPal** — pour les paiements internationaux\n• **MTN Mobile Money** — pour l\'accessibilité en Afrique 🌍\n\nLes deux sont disponibles pour les abonnements Premium et les retraits créateurs.' },
  { keywords: ['monétisation', 'revenus', 'gagner', 'rémunération', 'créateur revenus', 'combien gagne'], answer: 'Les créateurs Inkyo gagnent de l\'argent via deux canaux 💰 :\n\n• **20%** du pool global (revenus publicitaires + abonnements)\n• **15%** de soutien direct des abonnés Premium\n\nLes retraits se font via PayPal ou MTN Mobile Money depuis le Dashboard Créateur.' },

  // Commentaires & Communication
  { keywords: ['commentaire', 'commenter', 'message', 'écrire à l\'auteur', 'envoyer message'], answer: 'Pour commenter un webtoon 💬 :\n\n1️⃣ Ouvrez la liseuse d\'un webtoon\n2️⃣ Cliquez sur l\'icône 💬 dans la barre du bas\n3️⃣ Le panneau de commentaires s\'ouvre\n4️⃣ Écrivez votre message et envoyez !\n\nL\'auteur reçoit vos commentaires dans son Dashboard → onglet Messages.' },
  { keywords: ['annonce', 'broadcast', 'annoncer', 'problème auteur', 'signaler'], answer: 'Les auteurs connectés peuvent publier des **annonces** visibles par tous les membres 📢 :\n\n• Allez dans la section "Annonces des auteurs" sur l\'accueil\n• Cliquez sur "Annoncer"\n• Choisissez une catégorie : Problème 🔴, Question 🟡, Info 🟢\n• Les membres réagissent avec des emojis 👍❤️🔥\n\nIdéal pour signaler un problème ou poser une question à la communauté.' },
  { keywords: ['emoji', 'réaction', 'réagir', 'react'], answer: 'Sur les annonces des auteurs, tous les membres peuvent réagir avec des **emojis** : 👍 ❤️ 😂 😮 😢 🔥 💪 🙏. Cliquez simplement sur l\'emoji de votre choix, le compteur s\'incrémente en temps réel !' },

  // Eumène
  { keywords: ['eumène', 'eumene', 'e-shop', 'boutique', 'art-book', 'artbook', 'poster'], answer: '**Eumène** est le catalogue professionnel d\'Inkyo 🎨. Il proposera :\n\n• Art-books des œuvres populaires\n• Éditions papier collector\n• Posters HD et produits dérivés\n• Tout en **Print-on-Demand** avec livraison mondiale 🌍\n\nBasculez vers Eumène via le toggle dans la navbar. Le catalogue ouvrira prochainement !' },

  // Classement
  { keywords: ['classement', 'ranking', 'top', 'meilleur', 'populaire'], answer: 'La page **Classement** 🏆 affiche tous les webtoons triés par :\n\n• 👁️ Vues\n• ⭐ Note\n• 🔥 Votes\n• 📚 Épisodes\n\nVous pouvez aussi filtrer par genre. Le top 3 est affiché en podium visuel !' },

  // Compte
  { keywords: ['inscription', 'inscrire', 'créer compte', 'register', 'sign up'], answer: 'L\'inscription est gratuite et instantanée ⚡ :\n\n• **Google** — un clic\n• **TikTok** — un clic\n• **Email** — nom + email + mot de passe\n\nCliquez sur "Connexion" dans la navbar pour commencer.' },
  { keywords: ['connexion', 'connecter', 'login', 'se connecter'], answer: 'Cliquez sur **"Connexion"** dans la navbar. Vous pouvez vous connecter via Google, TikTok ou par email. La connexion est instantanée !' },
  { keywords: ['déconnexion', 'déconnecter', 'logout'], answer: 'Cliquez sur votre avatar en haut à droite, puis sur **"Déconnexion"** dans le menu déroulant.' },
  { keywords: ['dashboard', 'tableau de bord', 'stats', 'statistiques'], answer: 'Le **Dashboard Créateur** est accessible via votre avatar → "Dashboard". Il contient :\n\n📊 **Stats** — vues, likes, abonnés, messages\n📚 **Œuvres** — gérer vos publications\n💬 **Messages** — commentaires reçus des lecteurs\n💰 **Revenus** — suivi des gains + retrait PayPal/MTN\n🏅 **Badges** — votre progression gamification' },
  { keywords: ['badge', 'badges', 'gamification', 'récompense'], answer: 'Inkyo propose un système de **badges** 🏅 :\n\n📖 Premier Chapitre — lire votre 1er chapitre\n🗳️ Voix du Peuple — voter pour 10 œuvres\n🔥 Binge Reader — lire 50 chapitres en un jour\n✍️ Créateur — publier votre 1ère œuvre\n⭐ Star Montante — atteindre 1000 vues\n👑 VIP Inkyo — s\'abonner Premium\n🎨 Collectionneur — acheter 5 art-books\n💬 Influenceur — avoir 100 followers' },

  // Collaboration
  { keywords: ['collaboration', 'collaborer', 'équipe', 'cherche dessinateur', 'cherche scénariste'], answer: 'L\'**Espace Collaboration** sur l\'accueil permet de trouver des collaborateurs 🤝 :\n\n• Scénaristes ✍️\n• Dessinateurs 🎨\n• Coloristes 🖌️\n• Letterers 🔤\n• Traducteurs 🌍\n\nIdéal pour monter une équipe de création !' },

  // Support
  { keywords: ['aide', 'help', 'support', 'problème', 'bug', 'erreur'], answer: 'Pour obtenir de l\'aide :\n\n📋 **Centre d\'aide** — FAQ complète (lien dans le footer)\n📧 **Contact** — formulaire de contact (footer → Contact)\n🤖 **InkyBot** — c\'est moi ! Posez-moi vos questions ici\n📢 **Annonces** — signalez un problème à la communauté\n\nNous répondons sous 48h par email.' },
  { keywords: ['contact', 'contacter', 'email', 'mail'], answer: 'Vous pouvez nous contacter via :\n\n📧 **contact@inkyo.app**\n📋 Formulaire de contact (footer → Contact)\n🤖 Ou posez votre question ici à InkyBot !\n\nTemps de réponse : sous 48h.' },
  { keywords: ['conditions', 'cgu', 'règles', 'terms'], answer: 'Les conditions d\'utilisation sont disponibles via le footer → **Conditions**. Elles couvrent l\'inscription, la publication, les votes, la monétisation, le Premium et le comportement des utilisateurs.' },
  { keywords: ['confidentialité', 'données', 'rgpd', 'privacy', 'vie privée'], answer: 'Notre politique de confidentialité est disponible via le footer → **Confidentialité**. Nous ne vendons jamais vos données. Vous avez un droit d\'accès, de rectification et de suppression (RGPD). Les mots de passe sont chiffrés.' },
];

// ─── Smart matching ───
function findBestAnswer(input: string): string {
  const normalized = input.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[?!.,;:'"]/g, '');

  let bestMatch: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const normalizedKw = keyword.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      if (normalized.includes(normalizedKw)) {
        // Longer keyword matches = higher score
        score += normalizedKw.length;
      }
      // Partial word matching
      const words = normalizedKw.split(' ');
      for (const word of words) {
        if (word.length >= 3 && normalized.includes(word)) {
          score += word.length * 0.5;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore >= 3) {
    return bestMatch.answer;
  }

  // Fallback
  return 'Je ne suis pas sûr de comprendre votre question 🤔. Essayez de me demander :\n\n• Comment **publier** un webtoon\n• Comment fonctionne le **vote**\n• Les avantages **Premium**\n• Comment **lire** un webtoon\n• Comment **commenter** ou **contacter** un auteur\n• Les modes de **paiement**\n\nOu tapez un mot-clé comme "publier", "voter", "premium", "badge"...';
}

// ─── Types ───
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
}

// ─── Quick suggestions ───
const SUGGESTIONS = [
  'Comment publier ?',
  'Comment voter ?',
  'C\'est quoi Premium ?',
  'Comment lire ?',
  'Modes de paiement',
  'C\'est quoi Inkyo ?',
];

// ─── Component ───
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Bienvenue sur Inkyo ! 👋 Je suis **InkyBot**, votre assistant intelligent. Posez-moi n\'importe quelle question sur la plateforme !',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    const delay = 400 + Math.random() * 800;
    setTimeout(() => {
      const answer = findBestAnswer(text);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'bot',
        text: answer,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Simple markdown-like bold rendering
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-ink-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 z-80 w-14 h-14 bg-linear-to-br from-crimson to-crimson-dark rounded-full flex items-center justify-center text-white shadow-xl shadow-crimson/30 hover:shadow-crimson/50 hover:scale-105 active:scale-95 transition-all"
          >
            <Bot className="w-6 h-6" />
            {/* Pulse */}
            <span className="absolute inset-0 rounded-full bg-crimson animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-80 w-85 sm:w-95 max-h-[75vh] flex flex-col rounded-2xl overflow-hidden border border-ink-border/30 shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-crimson to-crimson-dark px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">InkyBot</h3>
                  <p className="text-[10px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> En ligne — Assistant Inkyo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-ink-dark px-3 py-3 space-y-3 min-h-62.5 max-h-[50vh]">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'bot'
                      ? 'bg-crimson/20 text-crimson'
                      : 'bg-ink-border/30 text-ink-muted'
                  }`}>
                    {msg.role === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[13px] leading-relaxed whitespace-pre-line ${
                    msg.role === 'bot'
                      ? 'bg-ink-card border border-ink-border/20 text-ink-text rounded-tl-sm'
                      : 'bg-crimson/15 border border-crimson/20 text-ink-text rounded-tr-sm'
                  }`}>
                    {renderText(msg.text)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-crimson/20 text-crimson flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3 py-2.5 bg-ink-card border border-ink-border/20 rounded-xl rounded-tl-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-ink-dark border-t border-ink-border/20 flex gap-1.5 overflow-x-auto hide-scrollbar">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="shrink-0 px-2.5 py-1.5 bg-ink-card border border-ink-border/30 rounded-lg text-[11px] text-ink-muted hover:text-ink-text hover:border-crimson/30 transition-all flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-crimson" /> {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-2.5 bg-ink-black border-t border-ink-border/30 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                className="flex-1 bg-ink-dark border border-ink-border/30 rounded-xl px-3 py-2 text-[13px] text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 transition-all"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className={`p-2 rounded-xl transition-all shrink-0 ${
                  input.trim()
                    ? 'bg-crimson text-white hover:bg-crimson-dark active:scale-95'
                    : 'bg-ink-dark text-ink-muted cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
