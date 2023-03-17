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
    description:string,
    images:{
        url:string
    }[],
}

const CategoryDetails: React.FC = () => {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
	const { getCategoryPlaylists, isLoading } = useSpotify();
	const [nextUrl, setNextUrl] = useState(null);
	const { categoryId } = useParams<CategoryIdDetails>();

	useEffect(() => {
		if (!isLoading) {
			const fetchPlaylists = async () => {
				if (categoryId) {
					const fetchedPlaylists = await getCategoryPlaylists(categoryId);
					setPlaylists(fetchedPlaylists?.items);
					setNextUrl(fetchedPlaylists?.next);
				}
			};
			fetchPlaylists();
		}
	}, [categoryId, isLoading]);
	const loadMorePlaylists = async () => {
		if (nextUrl) {
			const fetchedPlaylists = await getCategoryPlaylists(categoryId, nextUrl);
			setPlaylists(prevPlaylists => [...prevPlaylists, ...fetchedPlaylists.items]);
			setNextUrl(fetchedPlaylists.next);
		}
	};

	const handlePlaylistClick = (playlistId: string) => {
		setSelectedPlaylistId(playlistId);
	};
	console.log(playlists);
	return (
		<div>
			{!selectedPlaylistId && (
				<>
					{playlists.map((playlist, index) => (
						<div key={`${playlist.id}-${index}`} onClick={() => handlePlaylistClick(playlist.id)}>
							<img src={playlist.images[0].url} alt={playlist.description} />
							<h4>{playlist.name}</h4>
							<p>{playlist.description}</p>
						</div>
					))}
					<button disabled={!loadMorePlaylists} onClick={loadMorePlaylists}>
						Load more playlists
					</button>
				</>
			)}
			{selectedPlaylistId && <PlaylistDetails playlistId={selectedPlaylistId} />}
		</div>
	);
};

export default CategoryDetails;
