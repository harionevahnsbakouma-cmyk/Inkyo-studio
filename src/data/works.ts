import type { Work } from '../store/useStore';

export const WORKS: Work[] = [];

export const GENRES = ['Tout', 'Action', 'Romance', 'Sci-Fi', 'Fantasy', 'Horreur', 'Thriller', 'Mecha', 'Comédie'];

export const BADGES = [
  { id: 'first-read', name: 'Premier Chapitre', icon: '📖', desc: 'Lire votre premier chapitre' },
  { id: 'voter', name: 'Voix du Peuple', icon: '🗳️', desc: 'Voter pour 10 œuvres' },
  { id: 'binge', name: 'Binge Reader', icon: '🔥', desc: 'Lire 50 chapitres en une journée' },
  { id: 'creator', name: 'Créateur', icon: '✍️', desc: 'Publier votre première œuvre' },
  { id: 'popular', name: 'Star Montante', icon: '⭐', desc: 'Atteindre 1000 vues' },
  { id: 'premium', name: 'VIP Inkyo', icon: '👑', desc: 'S\'abonner à Premium' },
  { id: 'collector', name: 'Collectionneur', icon: '🎨', desc: 'Acheter 5 art-books' },
  { id: 'social', name: 'Influenceur', icon: '💬', desc: 'Avoir 100 followers' },
];
