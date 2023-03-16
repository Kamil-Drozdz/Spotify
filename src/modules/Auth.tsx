import React, { createContext, useEffect, useState } from 'react';
import { auth } from './firebase.js';
import Cookies from 'js-cookie';

import { RotatingLines } from 'react-loader-spinner';
import {
	signInWithEmailAndPassword,
	browserSessionPersistence,
	setPersistence,
	browserLocalPersistence,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

type AuthProviderProps = {
	children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<any | null>(null);
	const [pending, setPending] = useState<boolean>(true);
	const [rememberMe, setRememberMe] = useState(false);
	const [email, setEmail] = useState('');
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user;
				navigate('/welcome');
			})
			.catch(error => {
				setError(error.message);
			});
	};

	const getSpotifyAccessToken = async () => {
		try {
			const response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				body: 'grant_type=client_credentials',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${btoa(
						`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`
					)}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setAccessToken(data?.access_token);
				console.log(data.expires_in);
				Cookies.set('accessToken', data?.access_token, { expires: data?.expires_in / 3600 });
			} else {
				throw new Error(`Error getting Spotify access token: ${response.statusText}`);
			}
		} catch (error) {
			console.error('Error getting Spotify access token:', error);
			throw error;
		}
	};

	useEffect(() => {
		if (user) {
			const storedAccessToken = Cookies.get('accessToken');

			if (storedAccessToken) {
				setAccessToken(storedAccessToken);
			} else {
				getSpotifyAccessToken();
			}
		}
	}, [user]);

	useEffect(() => {
		const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
		setPersistence(auth, persistenceType)
			.then(() => {
				auth.onAuthStateChanged(user => {
					setUser(user);
					setPending(false);
				});
			})
			.catch(error => {
				setPending(false);
				console.error(error);
			});
	}, [rememberMe]);

	if (pending) {
		return (
			<div
				style={{
					width: '100vw',
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<RotatingLines strokeColor='green' strokeWidth='5' animationDuration='0.55' width='120' visible={true} />
				<p>Checking</p>
			</div>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				email,
				accessToken,
				setEmail,
				setPassword,
				password,
				rememberMe,
				error,
				setRememberMe,
				handleLogin,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
