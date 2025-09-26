// components/watched-card.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { WatchedItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Calendar, Edit3, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/tmdb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface WatchedCardProps {
  watchedItem: WatchedItem;
  onRemove: () => void;
}

export function WatchedCard({ watchedItem, onRemove }: WatchedCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(watchedItem.rating || 0);
  const [notes, setNotes] = useState(watchedItem.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/watched?id=${watchedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: rating || null,
          notes: notes || null,
        }),
      });
      if (!response.ok) throw new Error("Failed to update");
      toast.success("Watched item updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating watched item:", error);
      toast.error("Failed to update watched item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/watched?id=${watchedItem.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Watched item removed");
      onRemove();
    } catch (error) {
      console.error("Error removing watched item:", error);
      toast.error("Failed to remove watched item");
    }
  };

  const watchedDate = watchedItem.watchedDate
    ? format(new Date(watchedItem.watchedDate), "MMM dd, yyyy")
    : "Unknown date";

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[2/3] bg-muted">
        {watchedItem.poster_path ? (
          <Image
            src={getImageUrl(watchedItem.poster_path, "w500")}
            alt={watchedItem.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        {watchedItem.rating && (
          <div className="absolute top-2 right-2">
            <Badge className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary" />
              {watchedItem.rating}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">
          {watchedItem.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {watchedItem.overview.substring(0, 60)}
          {watchedItem.overview.length > 60 ? "..." : ""}
        </p>

        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{watchedDate}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline">
            {watchedItem.media_type === "movie" ? "Movie" : "TV Show"}
          </Badge>
        </div>

        {watchedItem.notes && (
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">Notes:</p>
            <p className="line-clamp-2">{watchedItem.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1">
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Watched Item</DialogTitle>
              <DialogDescription>
                Update your rating and notes for {watchedItem.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="rating">Rating (1-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value) || 0)}
                  placeholder="Rate from 1 to 10"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your thoughts about this content..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setRating(watchedItem.rating || 0);
                  setNotes(watchedItem.notes || "");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
