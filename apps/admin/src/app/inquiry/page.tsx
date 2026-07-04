import { DataTable, ValueBadge } from "@/components/DataTable";
import { PageShell } from "@/components/PageShell";
import { contentSource } from "@/lib/contentSource";

export const dynamic = "force-dynamic";

export default async function InquiryPage() {
  const [categories, cards] = await Promise.all([
    contentSource.listInquiryCategories(),
    contentSource.listInquiryCards(),
  ]);
  const categoryTitles = Object.fromEntries(categories.map((category) => [category.id, category.title]));

  return (
    <PageShell title="Inquiry" description="Question categories and the cards inside them.">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Categories
        </h2>
        <DataTable
          rows={categories}
          rowKey={(row) => row.id}
          emptyTitle="No categories yet"
          columns={[
            { header: "Title", render: (row) => row.title },
            { header: "Description", render: (row) => row.description ?? "—" },
            {
              header: "Cards",
              render: (row) => cards.filter((card) => card.category_id === row.id).length,
            },
            { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Cards
        </h2>
        <DataTable
          rows={cards}
          rowKey={(row) => row.id}
          emptyTitle="No inquiry cards yet"
          columns={[
            { header: "Prompt", render: (row) => row.question ?? row.prompt },
            { header: "Category", render: (row) => categoryTitles[row.category_id] ?? "—" },
            { header: "Moods", render: (row) => (row.mood_relevance.length > 0 ? row.mood_relevance.join(", ") : "—") },
            { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
            { header: "Visibility", render: (row) => <ValueBadge value={row.visibility} /> },
          ]}
        />
      </section>
    </PageShell>
  );
}
