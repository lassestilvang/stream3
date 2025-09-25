// store/index.ts
import { create } from 'zustand';
import { Movie, WatchedItem, WatchlistItem } from '@/types';

interface AppStore {
  // Search
  searchResults: Movie[];
  setSearchResults: (results: Movie[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isLoading: boolean) => void;
  searchError: string | null;
  setSearchError: (error: string | null) => void;

  // Watched content
  watchedItems: WatchedItem[];
  setWatchedItems: (items: WatchedItem[]) => void;
  addWatchedItem: (item: WatchedItem) => void;
  updateWatchedItem: (id: string, updates: Partial<WatchedItem>) => void;
  removeWatchedItem: (id: string) => void;
  isWatchedLoading: boolean;
  setIsWatchedLoading: (isLoading: boolean) => void;
  watchedError: string | null;
  setWatchedError: (error: string | null) => void;

  // Watchlist
  watchlistItems: WatchlistItem[];
  setWatchlistItems: (items: WatchlistItem[]) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: string) => void;
  isWatchlistLoading: boolean;
  setIsWatchlistLoading: (isLoading: boolean) => void;
  watchlistError: string | null;
  setWatchlistError: (error: string | null) => void;

  // UI state
  currentView: 'home' | 'watched' | 'watchlist';
  setCurrentView: (view: 'home' | 'watched' | 'watchlist') => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Search state
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearching: false,
  setIsSearching: (isLoading) => set({ isSearching: isLoading }),
  searchError: null,
  setSearchError: (error) => set({ searchError: error }),

  // Watched content state
  watchedItems: [],
  setWatchedItems: (items) => set({ watchedItems: items }),
  addWatchedItem: (item) => set((state) => ({ watchedItems: [...state.watchedItems, item] })),
  updateWatchedItem: (id, updates) => 
    set((state) => ({
      watchedItems: state.watchedItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    })),
  removeWatchedItem: (id) => 
    set((state) => ({
      watchedItems: state.watchedItems.filter(item => item.id !== id)
    })),
  isWatchedLoading: false,
  setIsWatchedLoading: (isLoading) => set({ isWatchedLoading: isLoading }),
  watchedError: null,
  setWatchedError: (error) => set({ watchedError: error }),

  // Watchlist state
  watchlistItems: [],
  setWatchlistItems: (items) => set({ watchlistItems: items }),
  addToWatchlist: (item) => set((state) => ({ watchlistItems: [...state.watchlistItems, item] })),
  removeFromWatchlist: (id) => 
    set((state) => ({
      watchlistItems: state.watchlistItems.filter(item => item.id !== id)
    })),
  isWatchlistLoading: false,
  setIsWatchlistLoading: (isLoading) => set({ isWatchlistLoading: isLoading }),
  watchlistError: null,
  setWatchlistError: (error) => set({ watchlistError: error }),

  // UI state
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),
}));