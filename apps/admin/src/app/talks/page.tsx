import { DataTable, ValueBadge } from "@/components/DataTable";
import { PageShell } from "@/components/PageShell";
import { contentSource } from "@/lib/contentSource";
import { formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TalksPage() {
  const talks = await contentSource.listAudioTalks();

  return (
    <PageShell title="Audio Talks" description="Standalone recorded talks.">
      <DataTable
        rows={talks}
        rowKey={(row) => row.id}
        emptyTitle="No talks yet"
        columns={[
          { header: "Title", render: (row) => row.title },
          { header: "Speaker", render: (row) => row.speaker ?? "—" },
          { header: "Duration", render: (row) => formatDuration(row.duration_seconds) },
          { header: "Audio", render: (row) => (row.audio_asset_id ? "attached" : "missing") },
          { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
          { header: "Visibility", render: (row) => <ValueBadge value={row.visibility} /> },
        ]}
      />
    </PageShell>
  );
}
