import { DataTable, ValueBadge } from "@/components/DataTable";
import { PageShell } from "@/components/PageShell";
import { getContentSource } from "@/lib/contentSource";
import { formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SilencePage() {
  const source = await getContentSource();
  const presets = await source.listSilencePresets();

  return (
    <PageShell title="Silence" description="Unguided sit presets with optional interval bells.">
      <DataTable
        rows={presets}
        rowKey={(row) => row.id}
        emptyTitle="No silence presets yet"
        columns={[
          { header: "Title", render: (row) => row.title },
          { header: "Duration", render: (row) => formatDuration(row.duration_seconds) },
          { header: "Bell interval", render: (row) => formatDuration(row.bell_interval_seconds) },
          { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
          { header: "Visibility", render: (row) => <ValueBadge value={row.visibility} /> },
          { header: "Order", render: (row) => row.sort_order },
        ]}
      />
    </PageShell>
  );
}
