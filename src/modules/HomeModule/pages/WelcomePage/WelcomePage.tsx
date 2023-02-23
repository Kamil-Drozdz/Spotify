import React from 'react';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.scss';

const WelcomePage: React.FC = () => {
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await auth.signOut();
			localStorage.removeItem('user');

			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};
	const idToken: any = localStorage.getItem('firebase');
	console.log(JSON.parse(idToken));
	return (
		<div className='container'>
			<p className='welcome'>
				Welcome {auth?.currentUser?.displayName ? auth.currentUser.displayName : auth?.currentUser?.email}!
			</p>
			<p className='welcome'>Email: {auth?.currentUser?.email}</p>
			<button className='logout-button' onClick={handleLogout}>
				Logout
			</button>
		</div>
	);
};

export default WelcomePage;
