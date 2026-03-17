/**
 * Shared glass-morphism + layered shadow system
 *
 * Shadow philosophy:
 *   - Multiple soft layers instead of a single hard drop-shadow
 *   - Tight + mid + ambient layers create natural depth
 *   - Inner highlight for that frosted-glass light edge
 *   - Dark mode uses deeper ambient layers; light mode stays feathery
 *
 * Elevation levels:
 *   card       – standard glassmorphism card (most UI surfaces)
 *   elevated   – featured / active cards that need to "pop"
 *   float      – overlays, modals, dropdowns
 *   subtle     – barely-there surfaces (collapsible panels, dividers)
 */

/* ───── shadow layer strings ───── */

// Dark-mode layered shadows
const darkShadowCard =
  "0 1px 2px rgba(0,0,0,0.24), 0 4px 12px rgba(0,0,0,0.18), 0 16px 32px rgba(0,0,0,0.14)";
const darkShadowElevated =
  "0 2px 4px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.22), 0 28px 56px rgba(0,0,0,0.16)";
const darkShadowFloat =
  "0 4px 8px rgba(0,0,0,0.32), 0 16px 32px rgba(0,0,0,0.26), 0 40px 80px rgba(0,0,0,0.2)";
const darkShadowSubtle =
  "0 1px 3px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.1)";

// Light-mode layered shadows
const lightShadowCard =
  "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.035)";
const lightShadowElevated =
  "0 2px 4px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06), 0 28px 56px rgba(0,0,0,0.045)";
const lightShadowFloat =
  "0 4px 8px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.07), 0 40px 80px rgba(0,0,0,0.055)";
const lightShadowSubtle =
  "0 1px 2px rgba(0,0,0,0.025), 0 6px 16px rgba(0,0,0,0.03)";

// Inner highlight (frosted-glass top edge)
const darkInner = "inset 0 1px 0 0 rgba(255,255,255,0.09)";
const lightInner = "inset 0 1px 0 0 rgba(255,255,255,0.65)";

// Button shadows
const darkBtnShadow =
  "0 1px 3px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.16)";
const lightBtnShadow =
  "0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.05)";

// CTA (gradient) button shadows
const ctaShadow =
  "0 2px 6px rgba(0,0,0,0.1), 0 8px 24px rgba(91,138,114,0.22), 0 20px 40px rgba(61,90,128,0.1)";
const ctaShadowActive =
  "0 1px 3px rgba(0,0,0,0.1), 0 4px 12px rgba(91,138,114,0.18)";


/* ───── helper to merge box-shadow layers ───── */
const merge = (...parts: string[]) => parts.join(", ");


/* ───── public API ───── */

export type Theme = "dark" | "light";

/** Standard glass card — the workhorse surface */
export function glassCard(theme: Theme): string {
  return theme === "dark"
    ? `bg-white/[0.06] backdrop-blur-sm border border-white/[0.12]`
    : `bg-white/30 backdrop-blur-sm border border-white/50`;
}

/** Card-level box-shadow style object */
export function glassCardShadow(theme: Theme): React.CSSProperties {
  return {
    boxShadow:
      theme === "dark"
        ? merge(darkShadowCard, darkInner)
        : merge(lightShadowCard, lightInner),
  };
}

/** Convenience: full class string + style — the most common combo */
export function glassCardClass(theme: Theme): string {
  // We encode shadows directly via Tailwind arbitrary
  return theme === "dark"
    ? [
        "bg-white/[0.06] backdrop-blur-sm border border-white/[0.12]",
        `[box-shadow:${merge(darkShadowCard, darkInner)}]`,
      ].join(" ")
    : [
        "bg-white/30 backdrop-blur-sm border border-white/50",
        `[box-shadow:${merge(lightShadowCard, lightInner)}]`,
      ].join(" ");
}

/** Elevated glass — featured cards, milestones, hero elements */
export function glassElevated(theme: Theme): string {
  return theme === "dark"
    ? [
        "bg-white/[0.07] backdrop-blur-md border border-white/[0.14]",
        `[box-shadow:${merge(darkShadowElevated, darkInner)}]`,
      ].join(" ")
    : [
        "bg-white/35 backdrop-blur-md border border-white/55",
        `[box-shadow:${merge(lightShadowElevated, lightInner)}]`,
      ].join(" ");
}

/** Float glass — overlays, guidance panels, dropdowns */
export function glassFloat(theme: Theme): string {
  return theme === "dark"
    ? [
        "bg-white/[0.06] backdrop-blur-md border border-white/[0.12]",
        `[box-shadow:${merge(darkShadowFloat, darkInner)}]`,
      ].join(" ")
    : [
        "bg-white/30 backdrop-blur-md border border-white/50",
        `[box-shadow:${merge(lightShadowFloat, lightInner)}]`,
      ].join(" ");
}

/** Subtle glass — collapsible panels, low-priority surfaces */
export function glassSubtle(theme: Theme): string {
  return theme === "dark"
    ? [
        "bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]",
        `[box-shadow:${merge(darkShadowSubtle, darkInner)}]`,
      ].join(" ")
    : [
        "bg-white/25 backdrop-blur-sm border border-white/40",
        `[box-shadow:${merge(lightShadowSubtle, lightInner)}]`,
      ].join(" ");
}

/** Icon / session-control buttons (pause, close, etc.) */
export function btnGlass(theme: Theme): string {
  return theme === "dark"
    ? [
        "bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)]",
        `backdrop-blur-sm [box-shadow:${merge(darkBtnShadow, darkInner)}]`,
        `active:[box-shadow:${merge("0 1px 2px rgba(0,0,0,0.2)", darkInner)}]`,
      ].join(" ")
    : [
        "bg-[rgba(255,255,255,0.45)] border border-[rgba(255,255,255,0.55)]",
        `backdrop-blur-sm [box-shadow:${merge(lightBtnShadow, lightInner)}]`,
        `active:[box-shadow:${merge("0 1px 2px rgba(0,0,0,0.04)", lightInner)}]`,
      ].join(" ");
}

/** Primary CTA gradient button shadow (Begin Practice, Enter Silence, etc.) */
export const ctaBtnShadowClass = `[box-shadow:${ctaShadow}] active:[box-shadow:${ctaShadowActive}]`;

/** A stronger "glow icon" shadow for completion checkmarks, etc. */
export function glowIconShadow(): string {
  return "[box-shadow:0_0_24px_rgba(91,138,114,0.3),0_8px_20px_rgba(61,90,128,0.15)]";
}