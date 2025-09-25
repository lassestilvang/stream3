'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useWatchlist } from '@/hooks/use-watchlist';
import { WatchlistCard } from '@/components/watchlist-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function WatchlistPage() {
  const { user, loading } = useAuth();
  const { watchlistItems, isLoading, error, fetchWatchlistItems, removeFromWatchlist } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchWatchlistItems(user.id);
    }
  }, [user?.id, fetchWatchlistItems]);

  const filteredItems = watchlistItems.filter((item: any) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <p className="text-muted-foreground">
          Movies and TV shows you want to watch
        </p>
      </header>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item: any) => (
                <WatchlistCard 
                  key={item.id} 
                  watchlistItem={item} 
                  onRemove={() => {
                    if (user?.id) {
                      removeFromWatchlist(item.id, user.id);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                {searchQuery ? 'No matches found' : 'Your watchlist is empty'}
              </p>
              <p className="text-muted-foreground mt-2">
                {searchQuery 
                  ? 'Try adjusting your search' 
                  : 'Search for content and add it to your watchlist'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}