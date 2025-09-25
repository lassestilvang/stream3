export interface Movie {
  id: number;
  title: string;
  name?: string; // For TV shows
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  genre_ids: number[];
}

export interface WatchedItem {
  id: string;
  userId: string;
  mediaId: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  watchedDate: string;
  rating?: number;
  notes?: string;
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaId: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  addedAt: string;
}