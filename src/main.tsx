import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global-styles/style.scss';
import { AuthProvider } from '../src/modules/Auth';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
