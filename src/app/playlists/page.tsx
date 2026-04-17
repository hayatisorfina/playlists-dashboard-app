import { getPlaylists } from "@/lib/api/playlists";
import { PlaylistListPage } from "@/features/playlists/PlaylistListPage";

export const dynamic = "force-dynamic";

export default async function PlaylistsPage() {
  const playlists = await getPlaylists().catch(() => []);
  
  return <PlaylistListPage initialData={playlists} />;
}
