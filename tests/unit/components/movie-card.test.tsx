// tests/unit/components/movie-card.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '@/components/movie-card';
import { Movie } from '@/types';

// Mock the services and hooks
jest.mock('@/services/content-service', () => ({
  addWatchedItem: jest.fn(() => Promise.resolve()),
  addToWatchlist: jest.fn(() => Promise.resolve()),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  overview: 'This is a test movie',
  vote_average: 8.5,
  media_type: 'movie',
  genre_ids: [18, 80],
};

describe('MovieCard', () => {
  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} userId="user123" />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText(/This is a test movie/)).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('allows adding to watched list', async () => {
    const { addWatchedItem } = require('@/services/content-service');
    render(<MovieCard movie={mockMovie} userId="user123" />);
    
    const watchedButton = screen.getByText('Watched');
    fireEvent.click(watchedButton);
    
    expect(addWatchedItem).toHaveBeenCalledWith({
      backdropPath: '/test-backdrop.jpg',
      mediaType: 'movie',
      mediaId: 1,
      overview: 'This is a test movie',
      posterPath: '/test-poster.jpg',
      title: 'Test Movie',
      userId: 'user123',
      voteAverage: 8.5,
      watchedDate: expect.any(String),
    });
  });

  it('allows adding to watchlist', async () => {
    const { addToWatchlist } = require('@/services/content-service');
    render(<MovieCard movie={mockMovie} userId="user123" />);
    
    const watchlistButton = screen.getByText('Watchlist');
    fireEvent.click(watchlistButton);
    
    expect(addToWatchlist).toHaveBeenCalledWith({
      backdropPath: '/test-backdrop.jpg',
      mediaType: 'movie',
      mediaId: 1,
      overview: 'This is a test movie',
      posterPath: '/test-poster.jpg',
      title: 'Test Movie',
      userId: 'user123',
      voteAverage: 8.5,
    });
  });

  it('disables buttons when no user is signed in', () => {
    render(<MovieCard movie={mockMovie} userId={undefined} />);
    
    const watchedButton = screen.getByText('Watched');
    const watchlistButton = screen.getByText('Watchlist');
    
    expect(watchedButton).toBeDisabled();
    expect(watchlistButton).toBeDisabled();
  });
});