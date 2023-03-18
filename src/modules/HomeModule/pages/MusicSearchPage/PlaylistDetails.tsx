import React, { useEffect, useState } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';
import './PlaylistDetails.scss';
import { formatDistanceToNow, parseISO, formatDuration, format } from 'date-fns';
import { BsClock } from 'react-icons/bs';
import { FiPlay, FiPause, FiVolumeX, FiVolume2 } from 'react-icons/fi';

interface PlaylistDetailsProps {
	playlistId: string;
}
interface Track {
	added_at: string;
	track: {
		id: number;
		album: {
			images: {
				url?: string;
			}[];
		};
		name: string;
		preview_url: string;
		external_urls: {
			spotify: string;
		};
	};
}

export const PlaylistDetails = ({ playlistId }: PlaylistDetailsProps) => {
	const { getPlaylistTracks, isLoading } = useSpotify();
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [tracks, setTracks] = useState([]);
	const [audioElement, setAudioElement] = useState(null);
	const handlePlay = trackId => {
		if (currentTrack === trackId) {
			setIsPlaying(!isPlaying);
		} else {
			setCurrentTrack(trackId);
			setIsPlaying(true);
		}
	};
	console.log(tracks[0]);
	const msToTime = duration => {
		let seconds = Math.floor((duration / 1000) % 60);
		let minutes = Math.floor((duration / (1000 * 60)) % 60);

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
			<h2 className='playlist-title'>Playlist Details</h2>
			<div className='playlist-details'>
				<div className='playlist-details__header'>
					<div># </div>
					<span title='song title'>Title</span>
					<span title='listen to the preview of the song'>Preview</span>
					<span>Spotify link(Premium)</span>
					<span>date added</span>
					<BsClock title='song duration' />
				</div>
				{tracks?.map((track: Track, index) => (
					<div className='playlist-details-item' key={track.track.id} onClick={() => setCurrentTrack(track?.track)}>
						<p>{index + 1}</p>
						<div className='playlist-details-item__describe'>
							<img
								className='playlist-details-item__image'
								src={track?.track?.album?.images[2]?.url}
								alt={track?.track?.artists[0]?.name}
							/>
							<span className='playlist-details-item__name'>
								{track?.track?.artists[0]?.name}
								<br />
								{track.track.name}
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
							onLoadedMetadata={e => setAudioElement(e.target)}
							onEnded={() => setIsPlaying(false)}
						/>

						<img className='playlist-details-item__image' src={currentTrack?.album?.images[2].url} />
						<span className='playlist-details-item__now-playing'>
							{currentTrack?.artists[0]?.name}
							<br />
							{currentTrack?.name}
						</span>
						<button className='playlist-details-item__play-button' onClick={() => setIsPlaying(!isPlaying)}>
							{isPlaying ? <FiPause /> : <FiPlay />}
						</button>

						<FiVolume2 />
					</div>
				)}
			</div>
		</div>
	);
};
