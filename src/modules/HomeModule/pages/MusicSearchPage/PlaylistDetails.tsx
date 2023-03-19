import React, { useEffect, useState, useRef } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';
import './PlaylistDetails.scss';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { BsClock, BsFillPlayFill } from 'react-icons/bs';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { BiPause } from 'react-icons/bi';

interface PlaylistDetailsProps {
	playlistId: string;
}
interface Track {
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
interface currentTrack {
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

export const PlaylistDetails = ({ playlistId }: PlaylistDetailsProps) => {
	const { getPlaylistTracks, isLoading } = useSpotify();
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [currentTrack, setCurrentTrack] = useState<currentTrack | null>(null);
	const [tracks, setTracks] = useState<Tracks>([]);
	const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
	const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
	const [volume, setVolume] = useState<number>(1);
	const [progress, setProgress] = useState<number>(0);
	const progressRef = useRef<HTMLInputElement>(null);
	const volumeRef = useRef<HTMLInputElement>(null);

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

	const findNextAvailableTrack = (currentIndex: number, direction: 1 | -1) => {
		let nextIndex = currentIndex + direction;
		while (nextIndex >= 0 && nextIndex < tracks.length) {
			if (tracks[nextIndex]?.track?.preview_url) {
				return nextIndex;
			}
			nextIndex += direction;
		}
		return null;
	};

	const handleNextTrack = () => {
		const currentIndex = tracks.findIndex(t => t.track.id === currentTrack?.id);
		const nextIndex = findNextAvailableTrack(currentIndex, 1);
		if (nextIndex !== null) {
			setCurrentTrack(tracks[nextIndex]?.track);
		}
	};

	const handlePreviousTrack = () => {
		const currentIndex = tracks.findIndex(t => t.track.id === currentTrack?.id);
		const prevIndex = findNextAvailableTrack(currentIndex, -1);
		if (prevIndex !== null) {
			setCurrentTrack(tracks[prevIndex]?.track);
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
				setCurrentTrack(tracks[firstAvailableIndex]?.track);
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
	const msToTime = (duration: number) => {
		let seconds: string | number = Math.floor((duration / 1000) % 60);
		let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);

		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;

		return minutes + ':' + seconds;
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

	useEffect(() => {
		if (!isLoading) {
			const fetchPlaylistTracks = async () => {
				const fetchedTracks = await getPlaylistTracks(playlistId);
				setTracks(fetchedTracks);
			};

			if (playlistId) {
				fetchPlaylistTracks();
			}
		}
	}, [playlistId, isLoading]);

	return (
		<div className='playlist'>
			<h2 className='playlist-title'>Playlist Details preview</h2>
			<div className='playlist-details'>
				<div className='playlist-details__header'>
					<div># </div>
					<span title='song title'>Title</span>
					<span title='listen to the preview of the song'>Preview</span>
					<span>Spotify link(Premium)</span>
					<span>date added</span>
					<BsClock title='song duration' />
				</div>
				{tracks?.map((track: Track, index: number) => (
					<div
						className={`playlist-details-item ${
							track.track.id === currentTrack?.id ? 'playlist-details-item--active' : ''
						}`}
						onMouseEnter={() => setHoveredTrack(index + 1)}
						onMouseLeave={() => setHoveredTrack(null)}
						key={track.track.id}
						onClick={() => setCurrentTrack(track?.track)}>
						<p className='playlist-details-item__number'>
							{index + 1 === hoveredTrack && track.track.id === currentTrack?.id ? (
								isPlaying ? (
									<BiPause onClick={() => setIsPlaying(false)} />
								) : (
									<BsFillPlayFill onClick={() => setIsPlaying(true)} />
								)
							) : index + 1 === hoveredTrack ? (
								<BsFillPlayFill onClick={() => setIsPlaying(true)} />
							) : (
								index + 1
							)}
						</p>
						<div className='playlist-details-item__describe'>
							<img
								className='playlist-details-item__image'
								src={track?.track?.album?.images[2]?.url}
								alt={track?.track?.artists[0]?.name}
							/>
							<span className='playlist-details-item__name'>
								<a href={track?.track?.artists[0]?.external_urls?.spotify}>{track?.track?.artists[0]?.name}</a>

								<a href={track?.track?.external_urls?.spotify}>{track?.track?.name}</a>
							</span>
						</div>
						{track?.track?.preview_url ? (
							<span className='playlist-details-item__avability'>avaible</span>
						) : (
							<span className='playlist-details-item__not-avability'> not avaible</span>
						)}
						<a className='playlist-details-item__link' href={track?.track?.external_urls?.spotify}>
							Spotify
						</a>
						<span className='playlist-details-item__date-added'>
							{formatDistanceToNow(parseISO(track.added_at), { addSuffix: true })}
						</span>

						<span className='playlist-details-item__duration'>{msToTime(track?.track?.duration_ms)}</span>
					</div>
				))}
				{currentTrack && (
					<div className='playlist-details__audio-player'>
						<audio
							autoPlay
							src={currentTrack?.preview_url}
							onLoadedMetadata={e => setAudioElement(e.currentTarget as HTMLAudioElement)}
							onEnded={() => setIsPlaying(false)}
						/>
						<div className='audio-player-item__artist'>
							<img className='audio-player-item__image' src={currentTrack?.album?.images[2]?.url} />
							<span className='audio-player-item__now-playing'>
								{currentTrack?.artists[0]?.name}
								<br />
								{currentTrack?.name}
							</span>
						</div>
						<div className='audio-player-item__console'>
							<div>
								<button
									className='audio-player-item__play-button audio-player-item__play-button--prev'
									onClick={handlePreviousTrack}>
									Prev
								</button>
								<button className='audio-player-item__play-button' onClick={() => setIsPlaying(!isPlaying)}>
									{isPlaying ? <BiPause size={34} /> : <BsFillPlayFill size={34} />}
								</button>

								<button
									className='audio-player-item__play-button audio-player-item__play-button--next'
									onClick={handleNextTrack}>
									Next
								</button>
							</div>
							<div className='audio-player-item__progress'>
								<input
									type='range'
									ref={progressRef}
									value={progress}
									onChange={handleProgressChange}
									min={0}
									max={100}
								/>
							</div>
						</div>
						<div className='audio-player-item__volume'>
							{volume ? (
								<FiVolume2
									size={44}
									onClick={() => {
										setVolume(0);
									}}
								/>
							) : (
								<FiVolumeX size={44} />
							)}

							<input
								type='range'
								ref={volumeRef}
								value={volume * 100}
								onChange={handleVolumeChange}
								min={0}
								max={100}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
