import { DataTable, ValueBadge } from "@/components/DataTable";
import { PageShell } from "@/components/PageShell";
import { getContentSource } from "@/lib/contentSource";
import { formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PracticesPage() {
  const source = await getContentSource();
  const practices = await source.listPracticeSessions();

  return (
    <PageShell title="Guided Practices" description="Audio-guided meditation sessions.">
      <DataTable
        rows={practices}
        rowKey={(row) => row.id}
        emptyTitle="No practices yet"
        columns={[
          { header: "Title", render: (row) => row.title },
          { header: "Category", render: (row) => row.category ?? "—" },
          { header: "Duration", render: (row) => formatDuration(row.duration_seconds) },
          { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
          { header: "Visibility", render: (row) => <ValueBadge value={row.visibility} /> },
          { header: "Order", render: (row) => row.sort_order },
        ]}
      />
    </PageShell>
  );
}
