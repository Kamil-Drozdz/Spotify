import React, { createContext, useEffect, useState } from 'react';
import { auth } from './firebase.js';

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
	const [user, setUser] = useState<any| null>(null);
	const [pending, setPending] = useState<boolean>(true);
	const [rememberMe, setRememberMe] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(email, password);
		await signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user;
				console.log(user);
				navigate('/welcome');
			})
			.catch(error => {
				setError(error.message);
			});
	};

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
			value={{ user, email, setEmail, setPassword, password, rememberMe, error, setRememberMe, handleLogin }}>
			{children}
		</AuthContext.Provider>
	);
};
