import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global-styles/style.scss';
import { AuthProvider } from '../src/modules/Auth';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<AuthProvider>
			<App />
		</AuthProvider>
	</BrowserRouter>
);
