// tests/unit/hooks/use-movies.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useMovies } from '@/hooks/use-movies';

// Mock the TMDB API
jest.mock('@/lib/tmdb', () => ({
  searchMovies: jest.fn(() => 
    Promise.resolve({
      page: 1,
      results: [
        {
          id: 1,
          title: 'Test Movie',
          poster_path: '/test.jpg',
          overview: 'Test overview',
          vote_average: 8.5,
          media_type: 'movie',
        }
      ],
      total_pages: 1,
      total_results: 1,
    })
  ),
}));

describe('useMovies', () => {
  it('searches for movies correctly', async () => {
    const { result } = renderHook(() => useMovies());
    
    result.current.searchMovies('Test');
    
    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].title).toBe('Test Movie');
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles empty search query', async () => {
    const { result } = renderHook(() => useMovies());
    
    result.current.searchMovies('');
    
    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(0);
    });
  });

  it('handles search errors', async () => {
    // Mock an error
    (require('@/lib/tmdb').searchMovies as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    const { result } = renderHook(() => useMovies());
    
    result.current.searchMovies('Test');
    
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to search movies. Please try again.');
    });
  });
});