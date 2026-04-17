import { getPlaylist } from "@/lib/api/playlists";
import { PlaylistDetailPage } from "@/features/playlists/PlaylistDetailPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const playlist = await getPlaylist(id);
    return <PlaylistDetailPage initialData={playlist} />;
  } catch (err) {
    notFound();
  }
}
