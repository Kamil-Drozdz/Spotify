import React, { createContext, useEffect, useState } from 'react';
import { auth } from './firebase.js';
import { RotatingLines } from 'react-loader-spinner';

export const AuthContext = createContext({});
type AuthProviderProps = {
	children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<user | null>(null);
	const [pending, setPending] = useState<boolean>(true);

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			setUser(user);
			setPending(false);
		});
	}, []);

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

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
