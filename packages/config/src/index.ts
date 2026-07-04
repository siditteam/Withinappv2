export const configPackageName = "@within/config" as const;

export interface AdminNavItem {
  readonly label: string;
  readonly href: string;
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Media", href: "/media" },
  { label: "Guided Practices", href: "/practices" },
  { label: "Silence", href: "/silence" },
  { label: "Inquiry", href: "/inquiry" },
  { label: "Library", href: "/library" },
  { label: "Daily Schedule", href: "/schedule" },
  { label: "Learn", href: "/learn" },
  { label: "Audio Talks", href: "/talks" },
  { label: "Common Space Rooms", href: "/rooms" },
  { label: "Inner Circle", href: "/inner-circle" },
  { label: "Feedback", href: "/feedback" },
  { label: "Analytics", href: "/analytics" },
];
