// hooks/use-watchlist.ts
import { useState, useEffect } from 'react';
import { getWatchlistItems, removeFromWatchlist } from '@/services/content-service';
import { WatchlistItem } from '@/types';

export const useWatchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlistItems = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const items = await getWatchlistItems(userId);
      setWatchlistItems(items);
    } catch (err) {
      console.error('Error fetching watchlist items:', err);
      setError('Failed to fetch watchlist items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlistHandler = async (id: string, userId: string) => {
    try {
      await removeFromWatchlist(id);
      setWatchlistItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove from watchlist. Please try again.');
      throw err;
    }
  };

  return {
    watchlistItems,
    isLoading,
    error,
    fetchWatchlistItems,
    removeFromWatchlist: removeFromWatchlistHandler,
  };
};