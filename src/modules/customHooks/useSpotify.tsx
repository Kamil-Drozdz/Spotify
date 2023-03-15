import { AuthContext } from '../Auth';
import { useContext } from 'react';

interface accessToken {
	accessToken: string;
}

export const useSpotify = () => {
	const { accessToken } = useContext(AuthContext) as AccessToken;

	const searchTracks = async (query: string): Promise<any[]> => {
		if (!accessToken) {
			return [];
		}

		const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			return data.tracks.items;
		} else {
			throw new Error(`Error searching tracks: ${response.statusText}`);
		}
	};

	const getCategories = async () => {
		const response = await fetch('https://api.spotify.com/v1/browse/categories', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const data = await response.json();
		return data?.categories?.items;
	};

	const getCategoryPlaylists = async (categoryId: string) => {
		try {
			const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Error fetching category playlists: ${response.statusText}`);
			}

			const data = await response.json();
			return data?.playlists?.items;
		} catch (error) {
			console.error('Error fetching category playlists:', error);
			return [];
		}
	};
	const getPlaylistTracks = async (playlistId: string) => {
		try {
			const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
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
			return [];
		}
	};

	return {
		searchTracks,
		getCategories,
		getCategoryPlaylists,
		getPlaylistTracks,
	};
};
