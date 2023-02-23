import React from 'react';
import { HomePage } from './modules/HomeModule/pages/HomePage/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegisterPage } from './modules/HomeModule/pages/RegisterPage/RegisterPage';
import WelcomePage from './modules/HomeModule/pages/WelcomePage/WelcomePage';
import PrivateRoute from './modules/PrivateRoute';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route element={<PrivateRoute />}>
					<Route path='/welcome' element={<WelcomePage />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
