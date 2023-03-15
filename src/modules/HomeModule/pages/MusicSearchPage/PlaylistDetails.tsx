import React, { useEffect, useState } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';

interface PlaylistDetailsProps {
	playlistId: string;
}

export const PlaylistDetails = ({ playlistId }: PlaylistDetailsProps) => {
	const { getPlaylistTracks } = useSpotify();
	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		const fetchPlaylistTracks = async () => {
			const fetchedTracks = await getPlaylistTracks(playlistId);
			setTracks(fetchedTracks);
		};

		if (playlistId) {
			fetchPlaylistTracks();
		}
	}, [playlistId]);
	console.log(tracks[0]?.track);
	return (
		<div>
			<h2>Playlist Details</h2>
			{tracks.map((track: Track) => (
				<div key={track.id}>
					<span>{track.name}</span>
					{track.track.preview_url ? (
						<audio controls>
							<source src={track.track.preview_url} type='audio/mpeg' />
							Your browser does not support the audio element.
						</audio>
					) : (
						<span>No preview available</span>
					)}
				</div>
			))}
		</div>
	);
};
