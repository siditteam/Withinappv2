export const uiPackageName = "@within/ui" as const;

export interface NavListItem {
  readonly label: string;
}

export interface NavListProps {
  readonly items: readonly NavListItem[];
}

export function NavList({ items }: NavListProps) {
  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
    </nav>
  );
}
