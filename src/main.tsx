import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './modules/ContextApi/Auth';
import { BrowserRouter } from 'react-router-dom';
import './global-styles/main.scss';
import { MusicPlayerProvider } from './modules/ContextApi/MusicPlayerContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<AuthProvider>
			<MusicPlayerProvider>
				<App />
			</MusicPlayerProvider>
		</AuthProvider>
	</BrowserRouter>
);
