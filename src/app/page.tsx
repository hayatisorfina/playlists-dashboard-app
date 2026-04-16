import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { StatusCard } from "@/components/ui/status-card";

const foundationItems = [
  "Next.js App Router with TypeScript enabled by default.",
  "Tailwind CSS foundation with shared tokens for layout, typography, forms, and UI states.",
  "Axios API helpers and shared TypeScript models are in place for playlist and media data.",
  "Validation tooling is installed and ready for reusable playlist forms.",
];

export default function Home() {
  return (
    <PageShell
      eyebrow="Digital Signage Dashboard"
      title="Frontend foundation is ready for playlist workflows."
      description="This starter app is prepared for server-rendered reads, client-side mutations, and reusable UI primitives."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/playlists" className="btn-primary">
            Open playlists
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Next.js docs
          </a>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {foundationItems.map((item) => (
          <StatusCard
            key={item}
            title="Foundation"
            tone="info"
            description={item}
          />
        ))}
      </section>
    </PageShell>
  );
}
