'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search-bar';
import MovieCard from '@/components/movie-card';
import { useAuth } from '@/hooks/use-auth';
import { useMovies } from '@/hooks/use-movies';
import { Movie } from '@/types';

export default function Home() {
  const { user, loading } = useAuth();
  const { searchResults, isLoading, error, searchMovies } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery.trim()) {
      searchMovies(searchQuery);
    } else {
      // Clear results when query is empty
    }
  }, [searchQuery, searchMovies]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Movie Tracker</h1>
        <p className="text-lg text-muted-foreground">
          Discover, track, and organize your movie and TV show collection
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-12">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for movies or TV shows..."
        />
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {searchQuery && searchResults.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((movie: Movie) => (
                  <MovieCard key={movie.id} movie={movie} userId={user?.id} />
                ))}
              </div>
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No results found</p>
              <p className="text-muted-foreground mt-2">
                Try searching for something else
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                Search for movies or TV shows to get started
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}