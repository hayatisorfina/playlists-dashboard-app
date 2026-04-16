export type MediaKind = "image" | "video" | "audio" | "document";

export type MediaItem = {
  id: string;
  name: string;
  type: MediaKind;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
};
