import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.scss';
import logoFacebook from '../../../../assets/images/icons8-facebook-30.png';
import logoApple from '../../../../assets/images/Apple-logo.png';
import logoGoogle from '../../../../assets/images/icons8-google-30.png';
import { auth } from '../../../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const HomePage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user;
				navigate('/welcome');
			})
			.catch(error => {
				setError(error.message);
			});
	};

	return (
		<div className='container'>
			<div className='login-section'>
				<h1 className='title'>Spotify</h1>
				<p className='text'>Please log in to Spotify to continue</p>
				<div className='buttons'>
					<a className='button-facebook'>
						<img src={logoFacebook} />
						Log in with facebook
					</a>
					<a className='button-apple'>
						<img src={logoApple} />
						Log in with Apple
					</a>
					<a className='button-google'>
						<img src={logoGoogle} />
						Log in with Google
					</a>
				</div>
				<p className='separator'>or</p>
				<form className='form-log-in' onSubmit={handleLogin}>
					<label className='input-text'>
						Email address or username
						<input
							placeholder='Email address or username'
							value={email}
							onChange={event => setEmail(event.target.value)}
						/>
					</label>
					<label className='input-text'>
						Password
						<input
							placeholder='Password'
							type='password'
							value={password}
							onChange={event => setPassword(event.target.value)}
						/>
					</label>

					<a href='#' className='reset-password-link'>
						Do not you remember the password?
					</a>
					{error && <p className='error'>{error}</p>}
					<div className='login'>
						<label className='input-remember-me'>
							<input className='checkbox-remember-me' type='checkbox' />
							<p>Remember me</p>
						</label>

						<button className='button-log-in'>Log in</button>
					</div>
				</form>
				<div>
					<a href='#' className='text'>
						You dont have account yet?
					</a>
					<Link to='/register'>
						<button className='button-register'>Sign up for spotify</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
