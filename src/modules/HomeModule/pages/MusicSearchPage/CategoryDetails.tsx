import React, { useState, useEffect } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';
import './CategoryDetails.scss';
import { PlaylistDetails } from './PlaylistDetails';

interface CategoryIdDetails {
	categoryId: string;
}

interface Playlist {
	id: string;
	name: string;
	description: string;
	images: {
		url: string;
	}[];
}

const CategoryDetails: React.FC<CategoryIdDetails> = ({ categoryId }) => {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
	const { getCategoryPlaylists, isLoading } = useSpotify();
	const [nextUrl, setNextUrl] = useState(null);

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

	return (
		<div className='categories'>
			<div className='categories-details'>
				{playlists.map((playlist, index) => (
					<div
						className='categories-details__item'
						key={`${playlist?.id}-${index}`}
						onClick={() => handlePlaylistClick(playlist?.id)}>
						<img
							className='categories-details__item__image'
							src={playlist?.images[0]?.url}
							alt={playlist?.description}
						/>
						<div className='categories-details__item__playicon'>▶</div>
					</div>
				))}
			</div>
			<button className='categories-details__button-load' disabled={!nextUrl} onClick={loadMorePlaylists}>
				Load more playlists
			</button>
			{selectedPlaylistId && <PlaylistDetails playlistId={selectedPlaylistId} />}
		</div>
	);
};

export default CategoryDetails;
