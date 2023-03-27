import React, { createContext, useState, useEffect } from 'react';

const MusicPlayerContext = createContext({});

type MusicProviderProps = {
	children: React.ReactNode;
};

export interface Track {
	id: number;
	added_at: string;
	track: {
		id: number;
		artists: {
			external_urls: {
				spotify: string;
			};
			name: string;
		}[];
		album: {
			name: string;
			images: {
				url?: string;
			}[];
		};
		name: string;
		preview_url: string;
		external_urls: {
			spotify: string;
		};
		duration_ms: number;
	};
}
export interface typeCurrentTrack {
	id: number;
	name: string;
	preview_url: string;
	artists: {
		name: string;
	}[];
	album: {
		name: string;
		images: {
			url?: string;
		}[];
	};
}
type Tracks = Track[];

export interface typeMusicPlayerContext {
	isPlaying: boolean;
	setIsPlaying: (isPlaying: boolean) => void;
	currentTrack: typeCurrentTrack | null;
	setCurrentTrack: (currentTrack: typeCurrentTrack | null) => void;
	audioElement: HTMLAudioElement | null;
	setAudioElement: (audioElement: HTMLAudioElement | null) => void;
	playPause: () => void;
	handleNextTrack: () => void;
	handlePreviousTrack: () => void;
	handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	progress: number;
	setProgress: (progress: number) => void;
	tracks: Tracks;
	volume: number;
	setVolume: (volume: number) => void;
	updateTracks: (tracks: Tracks) => void;
}

const MusicPlayerProvider: React.FC<MusicProviderProps> = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTrack, setCurrentTrack] = useState<typeCurrentTrack | null>(null);
	const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
	const [volume, setVolume] = useState<number>(1);
	const [tracks, setTracks] = useState<Tracks>([]);
	const [progress, setProgress] = useState<number>(0);

	const playPause = () => {
		setIsPlaying(!isPlaying);
	};

	const updateTracks = (newTracks: Tracks) => {
		setTracks(newTracks);
	};

	useEffect(() => {
		if (audioElement) {
			if (isPlaying && currentTrack) {
				audioElement.play();
			} else if (!isPlaying && currentTrack) {
				audioElement.pause();
			}
		}
	}, [isPlaying, currentTrack, audioElement]);

	const findNextAvailableTrack = (currentIndex: number, direction: 1 | -1) => {
		let nextIndex = currentIndex + direction;
		while (nextIndex >= 0 && nextIndex < tracks?.length) {
			if (tracks[nextIndex]?.track?.preview_url) {
				return nextIndex;
			}
			nextIndex += direction;
		}
		return null;
	};

	const handleNextTrack = () => {
		const currentIndex = tracks.findIndex(t => t.track?.id === currentTrack?.id);
		const nextIndex = findNextAvailableTrack(currentIndex, 1);
		if (nextIndex !== null) {
			setCurrentTrack(tracks[nextIndex]?.track || null);
		} else {
			const firstAvailableIndex = findNextAvailableTrack(-1, 1);
			if (firstAvailableIndex !== null) {
				setCurrentTrack(tracks[firstAvailableIndex]?.track || null);
			}
		}
	};

	const handlePreviousTrack = () => {
		const currentIndex = tracks.findIndex(t => t.track?.id === currentTrack?.id);
		const prevIndex = findNextAvailableTrack(currentIndex, -1);
		if (prevIndex !== null) {
			setCurrentTrack(tracks[prevIndex]?.track || null);
		}
	};
	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		const normalizedValue = value / 100;
		setVolume(normalizedValue);

		if (audioElement) {
			audioElement.volume = normalizedValue;
		}
	};

	const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const progress = parseFloat(e.target.value);
		setProgress(progress);
		if (audioElement) {
			audioElement.currentTime = (progress * audioElement.duration) / 100;
		}
	};

	useEffect(() => {
		if (audioElement) {
			audioElement.volume = volume;
		}
	}, [audioElement, volume]);

	useEffect(() => {
		if (tracks.length > 0) {
			const firstAvailableIndex = findNextAvailableTrack(-1, 1);
			if (firstAvailableIndex !== null) {
				setCurrentTrack(tracks[firstAvailableIndex]?.track || null);
				setIsPlaying(true);
			}
		}
	}, [tracks]);

	useEffect(() => {
		if (audioElement) {
			const handleTimeUpdate = () => {
				setProgress((audioElement.currentTime / audioElement.duration) * 100);
			};
			audioElement.addEventListener('timeupdate', handleTimeUpdate);
			return () => {
				audioElement.removeEventListener('timeupdate', handleTimeUpdate);
			};
		}
	}, [audioElement]);
	const value = {
		isPlaying,
		setIsPlaying,
		currentTrack,
		setCurrentTrack,
		audioElement,
		setAudioElement,
		playPause,
		handleNextTrack,
		handlePreviousTrack,
		handleVolumeChange,
		handleProgressChange,
		progress,
		setProgress,
		tracks,
		volume,
		setVolume,
		updateTracks,
	};

	return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
};

export { MusicPlayerContext, MusicPlayerProvider };
