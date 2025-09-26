// app/api/watched/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  addWatchedItem,
  getWatchedItems,
  updateWatchedItem,
  deleteWatchedItem,
  addToWatchedFromWatchlist,
} from "@/services/content-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.fromWatchlistId) {
      await addToWatchedFromWatchlist(body.fromWatchlistId);
      return NextResponse.json({ success: true });
    } else {
      const result = await addWatchedItem(body);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Error adding watched item:", error);
    return NextResponse.json(
      { error: "Failed to add watched item" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  try {
    const items = await getWatchedItems(userId);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error getting watched items:", error);
    return NextResponse.json(
      { error: "Failed to get watched items" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    const body = await request.json();
    await updateWatchedItem(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating watched item:", error);
    return NextResponse.json(
      { error: "Failed to update watched item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  try {
    await deleteWatchedItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting watched item:", error);
    return NextResponse.json(
      { error: "Failed to delete watched item" },
      { status: 500 }
    );
  }
}
