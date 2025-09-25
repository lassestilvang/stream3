// app/api/tmdb/search/route.ts
import { NextRequest } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const results = await searchMovies(query, parseInt(page));
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('TMDB search error:', error);
    return new Response(JSON.stringify({ error: 'Failed to search movies' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}