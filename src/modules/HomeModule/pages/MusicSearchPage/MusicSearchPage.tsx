import React, { useState, useEffect } from 'react';
import { useSpotify } from '../../../CustomHooks/useSpotify';
import './MusicSearchPage.scss';
import Header from '../../models/Header';
import CategoryDetails from '../HomePage/CategoryDetails';
import { BsFillPlayFill } from 'react-icons/bs';

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
interface CategoriesResponse {
	items: Category[];
	next: string | null;
}

export const MusicSearchPage: React.FC = () => {
	const [query, setQuery] = useState<string>('');
	const [tracks, setTracks] = useState<Track[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const { searchTracks, getCategories, isLoading } = useSpotify();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [categoryBackground, setCategoryBackground] = useState<string | null>(null);

	const handleCategoryClick = (categoryId: number, backgroundImage: string) => {
		setSelectedCategory(categoryId.toString());
		setCategoryBackground(backgroundImage);
	};

	useEffect(() => {
		if (!isLoading) {
			const fetchAllCategories = async () => {
				let nextUrl: any = null;
				let fetchedCategories: Category[] = [];
				do {
					const data: CategoriesResponse = await getCategories(nextUrl);
					fetchedCategories = [...fetchedCategories, ...data.items];
					nextUrl = data.next;
				} while (nextUrl);

				setCategories(fetchedCategories);
			};

			fetchAllCategories();
		}
	}, [isLoading]);

	const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		if (e.target.value && !isLoading) {
			const results = await searchTracks(e.target.value);
			const sortedResults = results.sort((a: Track, b: Track) => b.popularity - a.popularity);
			setTracks(sortedResults);
		} else {
			setTracks([]);
		}
	};

	const containerStyle = {
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundImage: categoryBackground ? `url(${categoryBackground})` : '',
	};

	return (
		<>
			{' '}
			<Header />
			<div style={containerStyle} className='music-search-page'>
				<input
					className='music-search-page__input'
					type='text'
					value={query}
					onChange={handleSearch}
					placeholder='What do you want to hear?'
				/>
				{query ? (
					<div className='music-search-page__track-list'>
						{tracks?.map(track => (
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
				) : (
					<div className='music-search-page__categories'>
						<h2 className='music-search-page__categories-title'>Your favorite categories</h2>
						<div className='music-search-page__category-list'>
							{categories?.map(category => (
								<div
									className='music-search-page__category-item'
									key={category.id}
									onClick={() => handleCategoryClick(category.id, category.icons[0].url)}>
									<img
										className='music-search-page__category-image'
										src={category.icons[0].url}
										alt={`Icon for ${category.name}`}
									/>
									<h3 className='music-search-page__category-name'>{category.name}</h3>
									<div className='music-search-page__category--playicon'>
										<BsFillPlayFill size={32} />
									</div>
								</div>
							))}
						</div>
						{selectedCategory && <CategoryDetails categoryId={selectedCategory} />}
					</div>
				)}
			</div>
		</>
	);
};