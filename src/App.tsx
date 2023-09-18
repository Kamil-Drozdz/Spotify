import { useContext } from 'react';
import { LoginPage } from './modules/HomeModule/pages/LoginPage/LoginPage';
import { HomePage } from './modules/HomeModule/pages/HomePage/HomePage';
import { Routes, Route } from 'react-router-dom';
import { RegisterPage } from './modules/HomeModule/pages/RegisterPage/RegisterPage';
import PrivateRoute from './modules/PrivateRoute';
import { MusicPlayerContext, typeCurrentTrack } from './modules/ContextApi/MusicPlayerContext';
import { MusicSearchPage } from './modules/HomeModule/pages/MusicSearchPage/MusicSearchPage';
import MusicPlayer from './modules/HomeModule/models/MusicPlayer';
import LiblaryPage from './modules/HomeModule/pages/LiblaryPage/LiblaryPage';
import { AuthContext } from './modules/ContextApi/Auth';

interface User {
	user: {
		email: string;
	};
}

const App: React.FC = () => {
	const { user } = useContext(AuthContext) as User;
	const { currentTrack } = useContext<{
		currentTrack?: typeCurrentTrack;
	}>(MusicPlayerContext);

	return (
		<>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route element={<PrivateRoute />}>
					<Route path='/homepage' element={<HomePage />} />
					<Route path='/liblary' element={<LiblaryPage />} />
					<Route path='/music-search' element={<MusicSearchPage />} />
				</Route>
			</Routes>
			{currentTrack && user?.email && <MusicPlayer />}
		</>
	);
};

export default App;
