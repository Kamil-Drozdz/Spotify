import React, { useState, useEffect } from 'react';
import { BsFillPlayFill } from 'react-icons/bs';
import { useSpotify } from './../../../CustomHooks/useSpotify';
import { PlaylistDetails } from './PlaylistDetails';
import './CategoryDetails.scss';

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
		<div id='categories-details'>
			{playlists?.length ? (
				<div className='categories'>
					<div className='categories-details'>
						{playlists?.map((playlist, index) => (
							<a href='#playlist-details' className='categories-details__item' key={`${playlist?.id}-${index}`} onClick={() => handlePlaylistClick(playlist?.id)}>
								<img className='categories-details__item__image' src={playlist?.images[0].url} alt={playlist?.description} />
								<div className='categories-details__item__playicon'>
									<BsFillPlayFill size={32} />
								</div>
							</a>
						))}
					</div>
					<button className='categories-details__button-load' disabled={!nextUrl} onClick={loadMorePlaylists}>
						Load more playlists
					</button>
					{selectedPlaylistId && <PlaylistDetails playlistId={selectedPlaylistId} />}
				</div>
			) : (
				<div>Ups we dont have this playlists now</div>
			)}
		</div>
	);
};

export default CategoryDetails;
