// services/content-service.ts
import { WatchedItem, WatchlistItem } from "@/types";
import { db } from "@/lib/db";
import { watchedContent, watchlist } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface AddWatchedItemParams {
  userId: string;
  mediaId: number;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  overview: string;
  voteAverage: number;
  mediaType: "movie" | "tv";
  watchedDate: string;
  rating?: number;
  notes?: string;
}

interface AddWatchlistItemParams {
  userId: string;
  mediaId: number;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  overview: string;
  voteAverage: number;
  mediaType: "movie" | "tv";
}

export const addWatchedItem = async (
  params: AddWatchedItemParams
): Promise<WatchedItem> => {
  const [result] = await db
    .insert(watchedContent)
    .values({
      id: uuidv4(),
      userId: params.userId,
      mediaId: params.mediaId,
      title: params.title,
      posterPath: params.posterPath,
      backdropPath: params.backdropPath,
      overview: params.overview,
      voteAverage: params.voteAverage,
      mediaType: params.mediaType,
      watchedDate: new Date(params.watchedDate),
      rating: params.rating,
      notes: params.notes,
    })
    .returning();

  return {
    id: result.id,
    userId: result.userId,
    mediaId: result.mediaId,
    title: result.title,
    poster_path: result.posterPath || undefined,
    backdrop_path: result.backdropPath || undefined,
    overview: result.overview || "",
    vote_average: result.voteAverage || 0,
    media_type: result.mediaType,
    watchedDate: result.watchedDate.toISOString(),
    rating: result.rating || undefined,
    notes: result.notes || undefined,
    createdAt: result.createdAt.toISOString(),
  };
};

export const getWatchedItems = async (
  userId: string
): Promise<WatchedItem[]> => {
  const results = await db
    .select()
    .from(watchedContent)
    .where(eq(watchedContent.userId, userId));

  return results.map((item) => ({
    id: item.id,
    userId: item.userId,
    mediaId: item.mediaId,
    title: item.title,
    poster_path: item.posterPath || undefined,
    backdrop_path: item.backdropPath || undefined,
    overview: item.overview || "",
    vote_average: item.voteAverage || 0,
    media_type: item.mediaType,
    watchedDate: item.watchedDate.toISOString(),
    rating: item.rating || undefined,
    notes: item.notes || undefined,
    createdAt: item.createdAt.toISOString(),
  }));
};

export const updateWatchedItem = async (
  id: string,
  updates: Partial<WatchedItem>
): Promise<void> => {
  const { watchedDate, createdAt, ...updateFields } = updates;
  await db
    .update(watchedContent)
    .set({
      ...updateFields,
      updatedAt: new Date(),
    })
    .where(eq(watchedContent.id, id));
};

export const deleteWatchedItem = async (id: string): Promise<void> => {
  await db.delete(watchedContent).where(eq(watchedContent.id, id));
};

export const addToWatchlist = async (
  params: AddWatchlistItemParams
): Promise<WatchlistItem> => {
  const [result] = await db
    .insert(watchlist)
    .values({
      id: uuidv4(),
      userId: params.userId,
      mediaId: params.mediaId,
      title: params.title,
      posterPath: params.posterPath,
      backdropPath: params.backdropPath,
      overview: params.overview,
      voteAverage: params.voteAverage,
      mediaType: params.mediaType,
    })
    .returning();

  return {
    id: result.id,
    userId: result.userId as string,
    mediaId: result.mediaId,
    title: result.title,
    poster_path: result.posterPath || undefined,
    backdrop_path: result.backdropPath || undefined,
    overview: result.overview || "",
    vote_average: result.voteAverage || 0,
    media_type: result.mediaType,
    addedAt: result.addedAt.toISOString(),
  };
};

export const getWatchlistItems = async (
  userId: string
): Promise<WatchlistItem[]> => {
  const results = await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId));

  return results.map((item) => ({
    id: item.id,
    userId: item.userId as string,
    mediaId: item.mediaId,
    title: item.title,
    poster_path: item.posterPath || undefined,
    backdrop_path: item.backdropPath || undefined,
    overview: item.overview || "",
    vote_average: item.voteAverage || 0,
    media_type: item.mediaType,
    addedAt: item.addedAt.toISOString(),
  }));
};

export const removeFromWatchlist = async (id: string): Promise<void> => {
  await db.delete(watchlist).where(eq(watchlist.id, id));
};

export const addToWatchedFromWatchlist = async (
  watchlistId: string
): Promise<void> => {
  // Get the watchlist item
  const [watchlistItem] = await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.id, watchlistId));

  if (!watchlistItem) {
    throw new Error("Watchlist item not found");
  }

  // Add to watched content
  await db.insert(watchedContent).values({
    userId: watchlistItem.userId as string,
    mediaId: watchlistItem.mediaId,
    title: watchlistItem.title,
    posterPath: watchlistItem.posterPath,
    backdropPath: watchlistItem.backdropPath,
    overview: watchlistItem.overview,
    voteAverage: watchlistItem.voteAverage,
    mediaType: watchlistItem.mediaType,
    watchedDate: new Date(),
  });

  // Remove from watchlist
  await db.delete(watchlist).where(eq(watchlist.id, watchlistId));
};
