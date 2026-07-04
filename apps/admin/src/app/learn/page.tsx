import { DataTable, ValueBadge } from "@/components/DataTable";
import { PageShell } from "@/components/PageShell";
import { contentSource } from "@/lib/contentSource";
import { formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const [series, episodes] = await Promise.all([
    contentSource.listLearnSeries(),
    contentSource.listLearnEpisodes(),
  ]);
  const seriesTitles = Object.fromEntries(series.map((entry) => [entry.id, entry.title]));

  return (
    <PageShell title="Learn" description="Teaching series and their episodes.">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Series
        </h2>
        <DataTable
          rows={series}
          rowKey={(row) => row.id}
          emptyTitle="No series yet"
          columns={[
            { header: "Title", render: (row) => row.title },
            { header: "Description", render: (row) => row.description ?? "—" },
            {
              header: "Episodes",
              render: (row) => episodes.filter((episode) => episode.series_id === row.id).length,
            },
            { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
            { header: "Visibility", render: (row) => <ValueBadge value={row.visibility} /> },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Episodes
        </h2>
        <DataTable
          rows={episodes}
          rowKey={(row) => row.id}
          emptyTitle="No episodes yet"
          columns={[
            { header: "Title", render: (row) => row.title },
            { header: "Series", render: (row) => seriesTitles[row.series_id] ?? "—" },
            { header: "Episode", render: (row) => row.episode_number },
            { header: "Duration", render: (row) => formatDuration(row.duration_seconds) },
            { header: "Audio", render: (row) => (row.audio_asset_id ? "attached" : "missing") },
            { header: "Status", render: (row) => <ValueBadge value={row.status} /> },
          ]}
        />
      </section>
    </PageShell>
  );
}
