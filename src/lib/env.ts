import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url("NEXT_PUBLIC_API_BASE_URL must be a valid absolute URL.")
    .transform((value) => value.replace(/\/+$/, "")),
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
