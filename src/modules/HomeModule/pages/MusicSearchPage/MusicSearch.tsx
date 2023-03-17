import React, { useState, useEffect } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';
import { useNavigate } from 'react-router-dom';
import './MusicSearch.scss';

type Track = {
	id: string;
	name: string;
	album: {
		name: string;
		images: Array<{ url: string }>;
	};
	artists: Array<{ name: string }>;
	preview_url: string;
	popularity: number;
	external_urls: {
		spotify: string;
	};
};
type Category = {
	id: number;
	name: string;
	icons: {
		url: string;
	}[];
	href: string;
};

export const MusicSearch: React.FC = () => {
	const navigate = useNavigate();
	const [query, setQuery] = useState<string>('');
	const [tracks, setTracks] = useState<Track[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [nextCategoriesUrl, setNextCategoriesUrl] = useState<string | null>(null);
	const { searchTracks, getCategories, isLoading } = useSpotify();

	useEffect(() => {
		if (!isLoading) {
			const fetchCategories = async () => {
				const fetchedCategories = await getCategories();
				setCategories(fetchedCategories?.items);
				setNextCategoriesUrl(fetchedCategories?.next);
			};

			fetchCategories();
		}
	}, [isLoading]);

	const loadMoreCategories = async () => {
		if (nextCategoriesUrl) {
			const fetchedData = await getCategories(nextCategoriesUrl);
			setCategories(prevCategories => [...prevCategories, ...fetchedData.items]);
			setNextCategoriesUrl(fetchedData?.next);
		}
	};

	const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		if (!isLoading) {
			const results = await searchTracks(query);
			setTracks(results);
		}
	};

	return (
		<div className='music-search'>
			Your favorite categories
			<div className='category-list'>
				{categories?.map(category => (
					<div className='category-list__item' key={category.id} onClick={() => navigate(`/categories/${category.id}`)}>
						<img className='category-list__item__image' src={category.icons[0].url} alt={`Icon for ${category.name}`} />
						<h3>{category.name}</h3>
						<div className='category-list__item__playicon'>▶</div>
					</div>
				))}
			</div>
			<button className='music-search__load-more' disabled={!nextCategoriesUrl} onClick={loadMoreCategories}>
				Load more category
			</button>
			<div>
				<input type='music-search__text' value={query} onChange={handleSearch} placeholder='Search for music' />
				{!query && !tracks.length && <div>Ups, we dont have this track</div>}
				<div className='track-list'>
					{tracks.map(track => (
						<div key={track.id} className='track-list__item'>
							<h3>Track name: {track.name}</h3>
							<p>
								Artist:
								{track.artists.map((artist, index) => (
									<span key={index}>{(index ? ', ' : '') + artist.name}</span>
								))}
							</p>
							<p>Album: {track.album.name}</p>
							{track.album.images[0] && (
								<img
									className='track-list__image'
									src={track.album.images[0].url}
									alt={`Album cover for ${track.album.name}`}
								/>
							)}
							Try this track!
							<audio src={track.preview_url} controls />
							<p>Popularity: {track.popularity}</p>
							<a href={track.external_urls.spotify}>Full track here</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
