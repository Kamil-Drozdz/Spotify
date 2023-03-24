import React, { useEffect, useState, useContext } from 'react';
import { useSpotify } from '../../../CustomHooks/useSpotify';
import './PlaylistDetails.scss';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { BsClock, BsFillPlayFill } from 'react-icons/bs';
import { BiPause } from 'react-icons/bi';
import { MusicPlayerContext, typeMusicPlayerContext,Track } from '@/modules/ContextApi/MusicPlayerContext';

interface PlaylistDetailsProps {
	playlistId: string;
}

export const PlaylistDetails = ({ playlistId }: PlaylistDetailsProps) => {
	const { isPlaying, setIsPlaying, currentTrack, setCurrentTrack, tracks, updateTracks } = useContext(
		MusicPlayerContext
	) as typeMusicPlayerContext;
	const { getPlaylistTracks, isLoading } = useSpotify();
	const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

	const msToTime = (duration: number) => {
		let seconds: string | number = Math.floor((duration / 1000) % 60);
		let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);

		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;

		return minutes + ':' + seconds;
	};

	useEffect(() => {
		if (!isLoading) {
			const fetchPlaylistTracks = async () => {
				const fetchedTracks = await getPlaylistTracks(playlistId);
				updateTracks(fetchedTracks);
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
						{track?.track?.preview_url ? (
							<p className='playlist-details-item__number'>
								{index + 1 === hoveredTrack && track.track.id === currentTrack?.id ? (
									isPlaying ? (
										<BiPause onClick={() => setIsPlaying(false)} />
									) : (
										<BsFillPlayFill onClick={() => setIsPlaying(true)} />
									)
								) : index + 1 === hoveredTrack ? (
									<BsFillPlayFill onClick={() => setIsPlaying(true)} />
								) : isPlaying && track.track.id === currentTrack?.id ? (
									<div className='playlist-details-item__number playlist-details-item__number--bar'>
										<span />
										<span />
										<span />
									</div>
								) : (
									index + 1
								)}
							</p>
						) : (
							<p className=' playlist-details-item__default'> {index + 1}</p>
						)}
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
			</div>
		</div>
	);
};
