import { PageShell, Note } from "@/components/PageShell";
import { contentSource } from "@/lib/contentSource";

// Admin pages always show current data rather than a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    practices,
    silencePresets,
    inquiryCategories,
    inquiryCards,
    libraryItems,
    quotes,
    rooms,
    learnSeries,
    learnEpisodes,
    talks,
  ] = await Promise.all([
    contentSource.listPracticeSessions(),
    contentSource.listSilencePresets(),
    contentSource.listInquiryCategories(),
    contentSource.listInquiryCards(),
    contentSource.listLibraryItems(),
    contentSource.listQuotes(),
    contentSource.listCommonSpaceRooms(),
    contentSource.listLearnSeries(),
    contentSource.listLearnEpisodes(),
    contentSource.listAudioTalks(),
  ]);

  const stats = [
    { label: "Guided Practices", count: practices.length },
    { label: "Silence Presets", count: silencePresets.length },
    { label: "Inquiry Categories", count: inquiryCategories.length },
    { label: "Inquiry Cards", count: inquiryCards.length },
    { label: "Library Items", count: libraryItems.length },
    { label: "Quotes", count: quotes.length },
    { label: "Common Space Rooms", count: rooms.length },
    { label: "Learn Series", count: learnSeries.length },
    { label: "Learn Episodes", count: learnEpisodes.length },
    { label: "Audio Talks", count: talks.length },
  ];

  return (
    <PageShell title="Dashboard" description="Read-only overview of the Within content catalog.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-2xl font-semibold text-black dark:text-zinc-50">{stat.count}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
      <Note>
        Editing and draft visibility arrive with the admin auth phase — writes require an
        authenticated session with an admin_roles row, which row-level security then trusts.
      </Note>
    </PageShell>
  );
}
