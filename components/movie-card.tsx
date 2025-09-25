// components/movie-card.tsx
'use client';

import { useState } from 'react';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, Plus, Calendar, Clock, Play, Eye, Check } from 'lucide-react';
import { toast } from 'sonner';
import { addWatchedItem, addToWatchlist } from '@/services/content-service';
import { format } from 'date-fns';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
  userId: string | undefined;
}

export default function MovieCard({ movie, userId }: MovieCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToWatched = async () => {
    if (!userId) {
      toast.error('Please sign in to track watched content');
      return;
    }

    setIsAdding(true);
    try {
      await addWatchedItem({
        userId,
        mediaId: movie.id,
        title: movie.title || movie.name || 'Unknown Title',
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        overview: movie.overview,
        voteAverage: movie.vote_average,
        mediaType: movie.media_type,
        watchedDate: new Date().toISOString(),
      });
      toast.success('Added to watched list!');
    } catch (error) {
      console.error('Error adding to watched:', error);
      toast.error('Failed to add to watched list');
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!userId) {
      toast.error('Please sign in to manage your watchlist');
      return;
    }

    setIsAdding(true);
    try {
      await addToWatchlist({
        userId,
        mediaId: movie.id,
        title: movie.title || movie.name || 'Unknown Title',
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        overview: movie.overview,
        voteAverage: movie.vote_average,
        mediaType: movie.media_type,
      });
      toast.success('Added to watchlist!');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
    } finally {
      setIsAdding(false);
    }
  };

  const releaseDate = movie.release_date || movie.first_air_date;
  const title = movie.title || movie.name || 'Unknown Title';

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[2/3] bg-muted">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={title}
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
            {movie.vote_average.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {movie.overview.substring(0, 80)}{movie.overview.length > 80 ? '...' : ''}
        </p>
        
        {releaseDate && (
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(releaseDate), 'yyyy')}</span>
          </div>
        )}
        
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline">{movie.media_type === 'movie' ? 'Movie' : 'TV Show'}</Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={handleAddToWatchlist}
          disabled={!userId || isAdding}
        >
          <Plus className="h-4 w-4 mr-1" />
          Watchlist
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleAddToWatched}
          disabled={!userId || isAdding}
        >
          <Eye className="h-4 w-4 mr-1" />
          Watched
        </Button>
      </CardFooter>
    </Card>
  );
}