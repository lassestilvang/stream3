'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useWatched } from '@/hooks/use-watched';
import { WatchedCard } from '@/components/watched-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Movie } from '@/types';

export default function WatchedPage() {
  const { user, loading } = useAuth();
  const { watchedItems, isLoading, error, fetchWatchedItems, deleteWatchedItem } = useWatched();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByDate, setFilterByDate] = useState('');
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchWatchedItems(user.id);
    }
  }, [user?.id, fetchWatchedItems]);

  useEffect(() => {
    let filtered = watchedItems;

    if (searchQuery) {
      filtered = filtered.filter((item: any) => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.overview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterByDate) {
      const date = new Date(filterByDate);
      filtered = filtered.filter((item: any) => 
        item.watchedDate && 
        new Date(item.watchedDate).toDateString() === date.toDateString()
      );
    }

    setFilteredItems(filtered);
  }, [watchedItems, searchQuery, filterByDate]);

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
        <h1 className="text-3xl font-bold">Watched Content</h1>
        <p className="text-muted-foreground">
          Your watched movies and TV shows
        </p>
      </header>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search watched content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="date"
              value={filterByDate}
              onChange={(e) => setFilterByDate(e.target.value)}
              className="pl-10"
              placeholder="Filter by date"
            />
          </div>
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
                <WatchedCard 
                  key={item.id} 
                  watchedItem={item} 
                  onRemove={() => {
                    if (user?.id) {
                      deleteWatchedItem(item.id, user.id);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                {searchQuery || filterByDate ? 'No matches found' : 'No watched content yet'}
              </p>
              <p className="text-muted-foreground mt-2">
                {searchQuery || filterByDate 
                  ? 'Try adjusting your search or filter' 
                  : 'Search for content to add to your watched list'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}