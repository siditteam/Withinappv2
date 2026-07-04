import { EmptySection, PageShell } from "@/components/PageShell";

export default function SchedulePage() {
  return (
    <PageShell title="Daily Schedule" description="Scheduled items surfaced to users on a given day.">
      <EmptySection
        title="Nothing scheduled yet"
        message="The daily_schedule table exists but has no entries, and scheduling tools arrive with the editing phase."
      />
    </PageShell>
  );
}
