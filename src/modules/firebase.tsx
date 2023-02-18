import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAa3ABSMvM0-F4BWpOxzSj4yebXr2Yjuhk',
	authDomain: 'spotify-rejestracja-logowanie.firebaseapp.com',
	projectId: 'spotify-rejestracja-logowanie',
	storageBucket: 'spotify-rejestracja-logowanie.appspot.com',
	messagingSenderId: '353114303698',
	appId: '1:353114303698:web:b128831801c287f2aa910b',
	measurementId: 'G-701PR41JFP',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 

export { app, analytics, auth }; 