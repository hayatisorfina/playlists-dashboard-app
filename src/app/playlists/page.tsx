import { PageShell } from "@/components/layout/page-shell";
import { StatusCard } from "@/components/ui/status-card";

export default function PlaylistsPage() {
  return (
    <PageShell
      eyebrow="Playlists"
      title="Playlist management will land here next."
      description="This placeholder route confirms the App Router structure is ready for the read-only dashboard shell in the next phase."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <StatusCard
          title="Ready"
          tone="success"
          description="The route exists, the shared layout is wired, and feature work can now focus on real playlist data."
        />
        <StatusCard
          title="Next step"
          tone="info"
          description="Implement server-fetched playlist list and details using the NestJS API."
        />
      </section>
    </PageShell>
  );
}
