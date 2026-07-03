export const configPackageName = "@within/config" as const;

export interface AdminNavItem {
  readonly label: string;
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard" },
  { label: "Media" },
  { label: "Guided Practices" },
  { label: "Silence" },
  { label: "Inquiry" },
  { label: "Library" },
  { label: "Daily Schedule" },
  { label: "Learn" },
  { label: "Audio Talks" },
  { label: "Common Space Rooms" },
  { label: "Inner Circle" },
  { label: "Feedback" },
  { label: "Analytics" },
];
