import React from 'react';
import { HomePage } from './modules/HomeModule/pages/HomePage/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegisterPage } from './modules/HomeModule/pages/RegisterPage/RegisterPage';
import WelcomePage from './modules/HomeModule/pages/WelcomePage/WelcomePage';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/welcome' element={<WelcomePage />} />
			</Routes>
		</Router>
	);
};

export default App;
