import { EmptySection, PageShell } from "@/components/PageShell";

export default function InnerCirclePage() {
  return (
    <PageShell title="Inner Circle" description="Invite-only membership for deeper practice.">
      <EmptySection
        title="Membership management isn't built yet"
        message="Granting memberships and generating invite codes require the admin auth phase, since both are writes gated by admin_roles."
      />
    </PageShell>
  );
}
