// components/watchlist-card.tsx
'use client';

import { useState } from 'react';
import { WatchlistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, Calendar, Clock, Play, Eye, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { removeFromWatchlist, addToWatchedFromWatchlist } from '@/services/content-service';
import { getImageUrl } from '@/lib/tmdb';

interface WatchlistCardProps {
  watchlistItem: WatchlistItem;
  onRemove: () => void;
}

export function WatchlistCard({ watchlistItem, onRemove }: WatchlistCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFromWatchlist = async () => {
    setIsRemoving(true);
    try {
      await removeFromWatchlist(watchlistItem.id);
      toast.success('Removed from watchlist');
      onRemove();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleMarkAsWatched = async () => {
    try {
      await addToWatchedFromWatchlist(watchlistItem.id);
      toast.success('Marked as watched');
      onRemove(); // Remove from watchlist after adding to watched
    } catch (error) {
      console.error('Error marking as watched:', error);
      toast.error('Failed to mark as watched');
    }
  };

  const addedDate = watchlistItem.addedAt 
    ? format(new Date(watchlistItem.addedAt), 'MMM dd, yyyy') 
    : 'Unknown date';

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[2/3] bg-muted">
        {watchlistItem.poster_path ? (
          <img
            src={getImageUrl(watchlistItem.poster_path, 'w500')}
            alt={watchlistItem.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary" />
            {watchlistItem.voteAverage?.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{watchlistItem.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {watchlistItem.overview.substring(0, 60)}{watchlistItem.overview.length > 60 ? '...' : ''}
        </p>
        
        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Added {addedDate}</span>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline">{watchlistItem.media_type === 'movie' ? 'Movie' : 'TV Show'}</Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 flex gap-2">
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleMarkAsWatched}
        >
          <Eye className="h-4 w-4 mr-1" />
          Watched
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={handleRemoveFromWatchlist}
          disabled={isRemoving}
        >
          {isRemoving ? <X className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}