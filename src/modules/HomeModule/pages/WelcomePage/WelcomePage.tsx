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
		<div className='container'>
			<p className='container__welcome'>
				Welcome {auth?.currentUser?.displayName ? auth.currentUser.displayName : auth?.currentUser?.email}!
			</p>
			<p className='container__welcome'>Email: {auth?.currentUser?.email}</p>
			<button className='container__button--logout' onClick={handleLogout}>
				Logout
			</button>
			<button
				className='container__button--preview'
				onClick={() => {
					navigate('/music-search');
				}}>
				see preview!
			</button>
		</div>
	);
};

export default WelcomePage;
