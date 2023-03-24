import React from 'react';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.scss';

const WelcomePage: React.FC = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await auth.signOut();
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='welcome-page'>
			<p className='welcome-page__name'>
				Welcome {auth?.currentUser?.displayName ? auth.currentUser.displayName : auth?.currentUser?.email}!
			</p>
			<p className='welcome-page__email'>Email: {auth?.currentUser?.email}</p>
			<button className='welcome-page__button--logout' onClick={handleLogout}>
				Logout
			</button>
			<button
				className='welcome-page__button--preview'
				onClick={() => {
					navigate('/homepage');
				}}>
				see preview!
			</button>
		</div>
	);
};

export default WelcomePage;
