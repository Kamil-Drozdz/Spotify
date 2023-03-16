import React, { useState, useEffect } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';
import { useParams } from 'react-router-dom';
import { PlaylistDetails } from './PlaylistDetails';

interface CategoryIdDetails {
	[categoryId: string]: string;
}

interface Playlist {
	id: string;
	name: string;
}

const CategoryDetails: React.FC = () => {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
	const { getCategoryPlaylists, isLoading } = useSpotify();
	const { categoryId } = useParams<CategoryIdDetails>();
	useEffect(() => {
		if (!isLoading) {
			const fetchPlaylists = async () => {
				if (categoryId) {
					const fetchedPlaylists = await getCategoryPlaylists(categoryId);
					setPlaylists(fetchedPlaylists);
				}
			};
			fetchPlaylists();
		}
	}, [categoryId, isLoading]);

	const handlePlaylistClick = (playlistId: string) => {
		setSelectedPlaylistId(playlistId);
	};

	return (
		<div>
			{!selectedPlaylistId &&
				playlists.map((playlist: Playlist) => (
					<div key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
						{playlist.name}
					</div>
				))}
			{selectedPlaylistId && <PlaylistDetails playlistId={selectedPlaylistId} />}
		</div>
	);
};

export default CategoryDetails;
