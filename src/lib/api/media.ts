import type { MediaItem } from "@/types/media";

import { apiClient } from "@/lib/api/client";

export async function getMediaItems(): Promise<MediaItem[]> {
  const response = await apiClient.get<MediaItem[]>("/media");
  return response.data;
}
