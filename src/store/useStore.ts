import { create } from 'zustand';

export interface Work {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  episodes: number;
  votes: number;
  views: string;
  rating: number;
  isPremium: boolean;
  isNew: boolean;
  isTrending: boolean;
  description: string;
  tags: string[];
}

export interface Comment {
  id: string;
  workId: string;
  workTitle: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface Broadcast {
  id: string;
  authorName: string;
  text: string;
  timestamp: number;
  reactions: Record<string, number>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  badges: string[];
  works: number;
  followers: number;
}

export type ActivePage = 'accueil' | 'classement' | 'votes' | 'aide' | 'conditions' | 'confidentialite' | 'contact' | 'a-propos';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  login: (user: User) => void;
  logout: () => void;

  // Navigation
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // Mode
  mode: 'inkyo' | 'eumene';
  setMode: (mode: 'inkyo' | 'eumene') => void;

  // Reader
  showReader: boolean;
  currentWork: Work | null;
  readerMode: 'vertical' | 'horizontal';
  setShowReader: (show: boolean) => void;
  setCurrentWork: (work: Work | null) => void;
  setReaderMode: (mode: 'vertical' | 'horizontal') => void;

  // Publish
  showPublishModal: boolean;
  setShowPublishModal: (show: boolean) => void;

  // Voting
  votedWorks: Set<string>;
  voteForWork: (workId: string) => void;

  // Dashboard
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;

  // Premium
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;

  // Concept
  showConcept: boolean;
  setShowConcept: (show: boolean) => void;

  // Comments
  comments: Comment[];
  addComment: (workId: string, workTitle: string, text: string) => void;
  markCommentsRead: (workId: string) => void;

  // Broadcasts (author announcements)
  broadcasts: Broadcast[];
  addBroadcast: (text: string) => void;
  addReaction: (broadcastId: string, emoji: string) => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  login: (user) => set({ isAuthenticated: true, user, showAuthModal: false }),
  logout: () => set({ isAuthenticated: false, user: null }),

  activePage: 'accueil',
  setActivePage: (page) => set({ activePage: page }),

  mode: 'inkyo',
  setMode: (mode) => set({ mode }),

  showReader: false,
  currentWork: null,
  readerMode: 'vertical',
  setShowReader: (show) => set({ showReader: show }),
  setCurrentWork: (work) => set({ currentWork: work }),
  setReaderMode: (mode) => set({ readerMode: mode }),

  showPublishModal: false,
  setShowPublishModal: (show) => set({ showPublishModal: show }),

  votedWorks: new Set(),
  voteForWork: (workId) => set((state) => {
    const newVoted = new Set(state.votedWorks);
    if (newVoted.has(workId)) {
      newVoted.delete(workId);
    } else {
      newVoted.add(workId);
    }
    return { votedWorks: newVoted };
  }),

  showDashboard: false,
  setShowDashboard: (show) => set({ showDashboard: show }),

  showPremiumModal: false,
  setShowPremiumModal: (show) => set({ showPremiumModal: show }),

  showConcept: false,
  setShowConcept: (show) => set({ showConcept: show }),

  comments: [],
  addComment: (workId, workTitle, text) => set((state) => {
    const user = state.user;
    const newComment: Comment = {
      id: crypto.randomUUID(),
      workId,
      workTitle,
      authorName: user?.name || 'Anonyme',
      authorAvatar: '',
      text,
      timestamp: Date.now(),
      isRead: false,
    };
    return { comments: [...state.comments, newComment] };
  }),
  markCommentsRead: (workId) => set((state) => ({
    comments: state.comments.map((c: Comment) =>
      c.workId === workId ? { ...c, isRead: true } : c
    ),
  })),

  broadcasts: [],
  addBroadcast: (text) => set((state) => {
    const user = state.user;
    const b: Broadcast = {
      id: crypto.randomUUID(),
      authorName: user?.name || 'Auteur',
      text,
      timestamp: Date.now(),
      reactions: {},
    };
    return { broadcasts: [b, ...state.broadcasts] };
  }),
  addReaction: (broadcastId, emoji) => set((state) => ({
    broadcasts: state.broadcasts.map((b: Broadcast) =>
      b.id === broadcastId
        ? { ...b, reactions: { ...b.reactions, [emoji]: (b.reactions[emoji] || 0) + 1 } }
        : b
    ),
  })),
}));
