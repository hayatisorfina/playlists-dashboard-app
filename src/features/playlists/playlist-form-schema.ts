import { z } from "zod";

export const playlistFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Playlist name is required.")
    .max(120, "Playlist name must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer."),
});

export type PlaylistFormSchema = z.infer<typeof playlistFormSchema>;
