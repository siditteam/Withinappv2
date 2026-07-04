import { DataTable, ValueBadge } from "@/components/DataTable";
import { PageShell } from "@/components/PageShell";
import { contentSource } from "@/lib/contentSource";
import { formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const rooms = await contentSource.listCommonSpaceRooms();

  return (
    <PageShell
      title="Common Space Rooms"
      description="Shared practice rooms. Live presence isn't built yet, so no occupancy is shown."
    >
      <DataTable
        rows={rooms}
        rowKey={(row) => row.id}
        emptyTitle="No rooms yet"
        columns={[
          { header: "Title", render: (row) => row.title },
          { header: "Type", render: (row) => row.room_type.replace("_", " ") },
          { header: "Public", render: (row) => (row.is_public ? "yes" : "no") },
          { header: "Duration", render: (row) => formatDuration(row.duration_seconds) },
          { header: "Purpose", render: (row) => row.purpose ?? "—" },
          { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
        ]}
      />
    </PageShell>
  );
}
