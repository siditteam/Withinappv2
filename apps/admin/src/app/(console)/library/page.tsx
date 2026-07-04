import { DataTable, ValueBadge } from "@/components/DataTable";
import { PageShell } from "@/components/PageShell";
import { getContentSource } from "@/lib/contentSource";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const source = await getContentSource();
  const [items, quotes] = await Promise.all([source.listLibraryItems(), source.listQuotes()]);

  return (
    <PageShell title="Library" description="Reflection cards and quotes of the day.">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Library items
        </h2>
        <DataTable
          rows={items}
          rowKey={(row) => row.id}
          emptyTitle="No library items yet"
          columns={[
            { header: "Body", render: (row) => row.title ?? row.body },
            { header: "Author", render: (row) => row.author ?? "—" },
            { header: "Linked inquiry", render: (row) => (row.related_inquiry_card_id ? "yes" : "—") },
            { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
            { header: "Visibility", render: (row) => <ValueBadge value={row.visibility} /> },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Quotes of the day
        </h2>
        <DataTable
          rows={quotes}
          rowKey={(row) => row.id}
          emptyTitle="No quotes yet"
          columns={[
            { header: "Quote", render: (row) => row.body },
            { header: "Author", render: (row) => row.author ?? "—" },
            { header: "Display date", render: (row) => row.display_date ?? "rotates daily" },
            { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
          ]}
        />
      </section>
    </PageShell>
  );
}
