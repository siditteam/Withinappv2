export const analyticsPackageName = "@within/analytics" as const;

export interface AnalyticsEvent {
  readonly name: string;
  readonly properties?: Record<string, unknown>;
}
