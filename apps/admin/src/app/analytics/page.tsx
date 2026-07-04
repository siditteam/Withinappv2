import { EmptySection, PageShell } from "@/components/PageShell";

export default function AnalyticsPage() {
  return (
    <PageShell title="Analytics" description="Practice and engagement metrics.">
      <EmptySection
        title="No analytics yet"
        message="Session logs currently live on-device only. Real metrics arrive once progress syncs to Supabase — nothing is shown here until then, rather than showing estimates."
      />
    </PageShell>
  );
}
