// app/api/watchlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addToWatchlist, getWatchlistItems, removeFromWatchlist } from "@/services/content-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await addToWatchlist(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  try {
    const items = await getWatchlistItems(userId);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error getting watchlist items:', error);
    return NextResponse.json({ error: 'Failed to get watchlist items' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  try {
    await removeFromWatchlist(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}
