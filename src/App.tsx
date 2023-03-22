import React from 'react';
import { LoginPage } from './modules/HomeModule/pages/LoginPage/LoginPage';
import { HomePage } from './modules/HomeModule/pages/HomePage/HomePage';
import { Routes, Route } from 'react-router-dom';
import { RegisterPage } from './modules/HomeModule/pages/RegisterPage/RegisterPage';
import WelcomePage from './modules/HomeModule/pages/WelcomePage/WelcomePage';
import PrivateRoute from './modules/PrivateRoute';
import { MusicSearchPage } from './modules/HomeModule/pages/MusicSearchPage/MusicSearchPage';

const App: React.FC = () => {
	return (
		<Routes>
			<Route path='/' element={<LoginPage />} />
			<Route path='/register' element={<RegisterPage />} />
			<Route element={<PrivateRoute />}>
				<Route path='/welcome' element={<WelcomePage />} />
				<Route path='/homepage' element={<HomePage />} />
				<Route path='/music-search' element={<MusicSearchPage />} />
			</Route>
		</Routes>
	);
};

export default App;
