import { AuthContext } from '../Auth';
import { useContext, useEffect, useState } from 'react';

interface AccessToken {
	accessToken: string;
}

export const useSpotify = () => {
	const { accessToken } = useContext(AuthContext) as AccessToken;
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (accessToken) {
			setIsLoading(false);
		}
	}, [accessToken]);

	const searchTracks = async (query: string) => {
		if (!accessToken) {
			return;
		}

		const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			return data?.tracks?.items;
		} else {
			throw new Error(`Error searching tracks: ${response.statusText}`);
		}
	};

	const getCategories = async (url?: string) => {
		const endpointCategories = url || 'https://api.spotify.com/v1/browse/categories';
		const response = await fetch(endpointCategories, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const data = await response.json();
		return data?.categories;
	};

	const getCategoryPlaylists = async (categoryId: string, url?: string) => {
		const endpointCategoriesPlaylists = url || `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`;
		try {
			const response = await fetch(endpointCategoriesPlaylists, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Error fetching category playlists: ${response.statusText}`);
			}
			const data = await response.json();
			return data?.playlists;
		} catch (error) {
			console.error('Error fetching category playlists:', error);
			return;
		}
	};
	const getPlaylistTracks = async (playlistId: string) => {
		const endpointPlaylist = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
		try {
			const response = await fetch(endpointPlaylist, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Error fetching playlist tracks: ${response.statusText}`);
			}

			const data = await response.json();
			return data?.items;
		} catch (error) {
			console.error('Error fetching playlist tracks:', error);
			return;
		}
	};

	return {
		isLoading,
		searchTracks,
		getCategories,
		getCategoryPlaylists,
		getPlaylistTracks,
	};
};
