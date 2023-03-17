import React, { useEffect, useState } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';
import './PlaylistDetails.scss';

interface PlaylistDetailsProps {
	playlistId: string;
}
interface Track {
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
	const [tracks, setTracks] = useState([]);

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
				{tracks?.map((track: Track) => (
					<div className='playlist-details__item' key={track.track.id}>
						<img className='playlist-details-item__image' src={track.track.album.images[2].url} />
						<span className='playlist-details-item__name'>{track.track.name}</span>
						{track.track.preview_url ? (
							<audio controls>
								<source src={track.track.preview_url} type='audio/mpeg' />
								Your browser does not support the audio element.
							</audio>
						) : (
							<span>
								No preview available check full track on <a href={track?.track?.external_urls?.spotify}>Spotify</a>
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
