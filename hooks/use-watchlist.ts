// hooks/use-watchlist.ts
import { useState, useEffect } from "react";
import { WatchlistItem } from "@/types";

export const useWatchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlistItems = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/watchlist?userId=" + userId);
      if (!response.ok) throw new Error("Failed to fetch");
      const items = await response.json();
      setWatchlistItems(items);
    } catch (err) {
      console.error("Error fetching watchlist items:", err);
      setError("Failed to fetch watchlist items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlistHandler = async (id: string, userId: string) => {
    try {
      const response = await fetch("/api/watchlist?id=" + id, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove");
      setWatchlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("Error removing from watchlist:", err);
      setError("Failed to remove from watchlist. Please try again.");
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
