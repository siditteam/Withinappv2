import { useCallback, useEffect, useRef, useState } from "react";

const trackModules = import.meta.glob("../../assets/Background Tracks/*.{mp3,wav,m4a,ogg,aac}", {
	eager: true,
	import: "default",
}) as Record<string, string>;

const trackUrls = Object.values(trackModules);
const AMBIENT_VOLUME_KEY = "withinapp:ambient-volume";
const AMBIENT_MUTED_KEY = "withinapp:ambient-muted";

function getStoredVolume(fallback: number) {
	if (typeof window === "undefined") {
		return fallback;
	}

	const storedValue = Number(window.localStorage.getItem(AMBIENT_VOLUME_KEY));
	if (Number.isNaN(storedValue)) {
		return fallback;
	}

	return Math.min(1, Math.max(0, storedValue));
}

function getStoredMuted() {
	if (typeof window === "undefined") {
		return false;
	}

	return window.localStorage.getItem(AMBIENT_MUTED_KEY) === "true";
}

function getRandomTrack(previousTrack?: string | null) {
	if (trackUrls.length === 0) {
		return null;
	}

	if (trackUrls.length === 1) {
		return trackUrls[0];
	}

	const eligibleTracks = trackUrls.filter((trackUrl) => trackUrl !== previousTrack);
	return eligibleTracks[Math.floor(Math.random() * eligibleTracks.length)] ?? trackUrls[0];
}

type UseBackgroundTrackOptions = {
	volume?: number;
};

export function useBackgroundTrack(isActive: boolean, options: UseBackgroundTrackOptions = {}) {
	const { volume: defaultVolume = 0.18 } = options;
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const activeRef = useRef(isActive);
	const lastTrackRef = useRef<string | null>(null);
	const [volume, setVolume] = useState(() => getStoredVolume(defaultVolume));
	const [isMuted, setIsMuted] = useState(() => getStoredMuted());

	const toggleMuted = useCallback(() => {
		setIsMuted((currentValue) => !currentValue);
	}, []);

	useEffect(() => {
		activeRef.current = isActive;
	}, [isActive]);

	const playTrack = useCallback(async (trackUrl: string) => {
		const audio = audioRef.current ?? new Audio();
		audioRef.current = audio;
		audio.preload = "auto";
		audio.volume = volume;
		audio.muted = isMuted;

		if (audio.src !== trackUrl) {
			audio.src = trackUrl;
		}

		try {
			await audio.play();
		} catch {
			// Ignore autoplay rejections; the next user gesture can resume playback.
		}
	}, [isMuted, volume]);

	const playRandomTrack = useCallback(async () => {
		const nextTrack = getRandomTrack(lastTrackRef.current);
		if (!nextTrack) {
			return;
		}

		lastTrackRef.current = nextTrack;
		await playTrack(nextTrack);
	}, [playTrack]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			audioRef.current.muted = isMuted;
		}
	}, [isMuted, volume]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		window.localStorage.setItem(AMBIENT_VOLUME_KEY, String(volume));
	}, [volume]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		window.localStorage.setItem(AMBIENT_MUTED_KEY, String(isMuted));
	}, [isMuted]);

	useEffect(() => {
		if (!trackUrls.length) {
			return;
		}

		if (!isActive) {
			audioRef.current?.pause();
			return;
		}

		const audio = audioRef.current;
		if (audio?.src) {
			audio.volume = volume;
			audio.muted = isMuted;
			void audio.play().catch(() => undefined);
			return;
		}

		void playRandomTrack();
	}, [isActive, isMuted, playRandomTrack, volume]);

	useEffect(() => {
		const audio = audioRef.current ?? new Audio();
		audioRef.current = audio;

		const handleEnded = () => {
			if (!activeRef.current) {
				return;
			}

			void playRandomTrack();
		};

		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("ended", handleEnded);
			audio.pause();
			audio.currentTime = 0;
			audio.removeAttribute("src");
			audio.load();
		};
	}, [playRandomTrack]);

	return {
		isMuted,
		setIsMuted,
		toggleMuted,
		volume,
		setVolume,
	};
}
