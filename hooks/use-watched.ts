// hooks/use-watched.ts
import { useState, useEffect } from 'react';
import { getWatchedItems, deleteWatchedItem } from '@/services/content-service';
import { WatchedItem } from '@/types';

export const useWatched = () => {
  const [watchedItems, setWatchedItems] = useState<WatchedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchedItems = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const items = await getWatchedItems(userId);
      setWatchedItems(items);
    } catch (err) {
      console.error('Error fetching watched items:', err);
      setError('Failed to fetch watched items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWatchedItemHandler = async (id: string, userId: string) => {
    try {
      await deleteWatchedItem(id);
      setWatchedItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting watched item:', err);
      setError('Failed to delete watched item. Please try again.');
      throw err;
    }
  };

  return {
    watchedItems,
    isLoading,
    error,
    fetchWatchedItems,
    deleteWatchedItem: deleteWatchedItemHandler,
  };
};