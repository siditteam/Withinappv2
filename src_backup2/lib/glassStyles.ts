type ThemeMode = "light" | "dark";

export function glassCardClass(theme: ThemeMode): string {
	return theme === "dark"
		? "border border-white/10 bg-white/[0.06] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.28)]"
		: "border border-white/70 bg-white/55 backdrop-blur-[20px] shadow-[0_10px_30px_rgba(74,93,184,0.10)]";
}

export function glassElevated(theme: ThemeMode): string {
	return theme === "dark"
		? "border border-white/12 bg-white/[0.08] backdrop-blur-[24px] shadow-[0_16px_44px_rgba(0,0,0,0.34)]"
		: "border border-white/75 bg-white/68 backdrop-blur-[24px] shadow-[0_18px_45px_rgba(74,93,184,0.14)]";
}

export function glassSubtle(theme: ThemeMode): string {
	return theme === "dark"
		? "border border-white/[0.08] bg-white/[0.04] backdrop-blur-[16px]"
		: "border border-white/60 bg-white/40 backdrop-blur-[16px]";
}

export function glassFloat(theme: ThemeMode): string {
	return theme === "dark"
		? "border border-white/10 bg-black/20 backdrop-blur-[18px] shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
		: "border border-white/70 bg-white/50 backdrop-blur-[18px] shadow-[0_12px_32px_rgba(74,93,184,0.12)]";
}

export function btnGlass(theme: ThemeMode): string {
	return theme === "dark"
		? "border border-white/12 bg-white/10 backdrop-blur-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
		: "border border-white/75 bg-white/65 backdrop-blur-[14px] shadow-[0_8px_22px_rgba(74,93,184,0.12)]";
}

export const ctaBtnShadowClass =
	"shadow-[0_16px_40px_rgba(61,90,128,0.28)] hover:shadow-[0_18px_44px_rgba(61,90,128,0.34)]";

export function glowIconShadow(color = "rgba(91,138,114,0.28)"): string {
	return `shadow-[0_0_24px_${color}]`;
}
export * from "../lib/glassStyles";
