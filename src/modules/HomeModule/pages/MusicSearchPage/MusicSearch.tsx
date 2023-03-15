import React, { useContext, useState, ChangeEvent, useEffect } from 'react';
import { AuthContext } from '../../../Auth';
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

export const MusicSearch: React.FC = () => {
	const { user } = useContext<any>(AuthContext);
	const navigate = useNavigate();
	const [query, setQuery] = useState<string>('');
	const [tracks, setTracks] = useState<Track[]>([]);
	const [categories, setCategories] = useState([]);
	const { searchTracks, getCategories } = useSpotify();

	useEffect(() => {
		const fetchCategories = async () => {
			const fetchedCategories = await getCategories();
			setCategories(fetchedCategories);
		};

		fetchCategories();
	}, []);

	const handleSearch = async e => {
		setQuery(e.target.value);
		const results = await searchTracks(query);
		setTracks(results);
	};

	if (!user) {
		return <div>You are not logged in.</div>;
	}

	return (
		<>
			{categories?.map(category => (
				<div key={category.id} onClick={() => navigate(`/categories/${category.id}`)}>
					<h3>{category.name}</h3>
					<img src={category.icons[0].url} alt={`Icon for ${category.name}`} />
					<a href={category.href}>x</a>
				</div>
			))}
			<div>
				<input type='text' value={query} onChange={handleSearch} placeholder='Search for music' />

				{tracks.map(track => (
					<div key={track.id}>
						<h3>Track name: {track.name}</h3>
						<p>
							Artist:{' '}
							{track.artists.map((artist, index) => (
								<span key={index}>{(index ? ', ' : '') + artist.name}</span>
							))}
						</p>
						<p>Album: {track.album.name}</p>
						{track.album.images[0] && (
							<img
								className='categories-image'
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
		</>
	);
};
