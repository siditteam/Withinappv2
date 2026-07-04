import { EmptySection, PageShell } from "@/components/PageShell";

export default function FeedbackPage() {
  return (
    <PageShell title="Feedback" description="Messages from users of the mobile app.">
      <EmptySection
        title="No feedback yet"
        message="Feedback rows are per-user and protected by row-level security, so reading them here requires the admin auth phase."
      />
    </PageShell>
  );
}
