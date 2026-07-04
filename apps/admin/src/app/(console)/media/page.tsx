import { EmptySection, PageShell } from "@/components/PageShell";

export default function MediaPage() {
  return (
    <PageShell title="Media" description="Audio, image, and video assets behind the content catalog.">
      <EmptySection
        title="Media management isn't built yet"
        message="Uploads, the asset browser, and the published-content deletion guard arrive with the storage phase. Content rows currently reference placeholder assets."
      />
    </PageShell>
  );
}
