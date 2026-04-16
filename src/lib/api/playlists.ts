import type {
  CreatePlaylistPayload,
  Playlist,
  UpdatePlaylistPayload,
} from "@/types/playlist";

import { apiClient } from "@/lib/api/client";

export async function getPlaylists(): Promise<Playlist[]> {
  const response = await apiClient.get<Playlist[]>("/playlist");
  return response.data;
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const response = await apiClient.get<Playlist>(`/playlist/${id}`);
  return response.data;
}

export async function createPlaylist(
  payload: CreatePlaylistPayload,
): Promise<Playlist> {
  const response = await apiClient.post<Playlist>("/playlist", payload);
  return response.data;
}

export async function updatePlaylist(
  id: string,
  payload: UpdatePlaylistPayload,
): Promise<Playlist> {
  const response = await apiClient.patch<Playlist>(`/playlist/${id}`, payload);
  return response.data;
}

export async function addMediaToPlaylist(
  playlistId: string,
  mediaId: string,
): Promise<Playlist> {
  const response = await apiClient.post<Playlist>(
    `/playlist/${playlistId}/media/${mediaId}`,
  );
  return response.data;
}

export async function removeMediaFromPlaylist(
  playlistId: string,
  mediaId: string,
): Promise<void> {
  await apiClient.delete(`/playlist/${playlistId}/media/${mediaId}`);
}
