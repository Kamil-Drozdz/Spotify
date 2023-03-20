import React, { useState, useEffect, useContext } from 'react';
import { useSpotify } from '../../../customHooks/useSpotify';
import { useNavigate } from 'react-router-dom';
import './MusicSearch.scss';
import { AuthContext } from '@/modules/Auth';
import CategoryDetails from './CategoryDetails';
import { AiOutlineUser } from 'react-icons/ai';
import { BsFillPlayFill } from 'react-icons/bs';
import { auth } from '@/modules/firebase';

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
type Auth = {
	user?: {
		displayName: string;
	};
};

export const MusicSearch: React.FC = () => {
	const navigate = useNavigate();
	const [query, setQuery] = useState<string>('');
	const [tracks, setTracks] = useState<Track[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [nextCategoriesUrl, setNextCategoriesUrl] = useState<string | null>(null);
	const { searchTracks, getCategories, isLoading } = useSpotify();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [categoryBackground, setCategoryBackground] = useState<string | null>(null);
	const { user } = useContext<Auth>(AuthContext);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await auth.signOut();
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};

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
	const handleCategoryClick = (categoryId: number, backgroundImage: string) => {
		setSelectedCategory(categoryId.toString());
		setCategoryBackground(backgroundImage);
	};

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
	const containerStyle = {
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundImage: categoryBackground ? `url(${categoryBackground})` : '',
	};

	return (
		<div style={containerStyle} className='music-search'>
			<div className='music-search-header'>
				<h2 className='music-search-header__title'>Your favorite categories</h2>
				<div
					className='music-search-header__user'
					onClick={() => {
						setDropdownOpen(!dropdownOpen);
					}}>
					<AiOutlineUser title={user?.displayName} className='music-search-header__user-icon' />
					<span className='music-search-header__user-displayName'>{user?.displayName}</span>
					{dropdownOpen && (
						<div className='music-search-header__dropdown'>
							<button>Settings</button>
							<button onClick={handleLogout}>Logout</button>
						</div>
					)}
				</div>
			</div>
			<div className='category-list'>
				{categories?.map(category => (
					<div
						className='category-list__item'
						key={category.id}
						onClick={() => handleCategoryClick(category.id, category.icons[0].url)}>
						<img className='category-list__item__image' src={category.icons[0].url} alt={`Icon for ${category.name}`} />
						<h3>{category.name}</h3>
						<div className='category-list__item__playicon'>
							<BsFillPlayFill size={32} />
						</div>
					</div>
				))}
			</div>
			<button className='music-search__load-more' disabled={!nextCategoriesUrl} onClick={loadMoreCategories}>
				Load more category
			</button>
			{selectedCategory && <CategoryDetails categoryId={selectedCategory} />}
			<div>
				<input type='music-search__text' value={query} onChange={handleSearch} placeholder='Search for music' />
				{!!query && !tracks.length && <div>Ups, we dont have this track</div>}
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
