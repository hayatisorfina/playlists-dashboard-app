import type { MediaItem } from "@/types/media";

export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  mediaItems: MediaItem[];
  createdAt: string;
  updatedAt: string;
};

export type PlaylistFormValues = {
  name: string;
  description: string;
};

export type CreatePlaylistPayload = PlaylistFormValues;

export type UpdatePlaylistPayload = Partial<PlaylistFormValues>;
