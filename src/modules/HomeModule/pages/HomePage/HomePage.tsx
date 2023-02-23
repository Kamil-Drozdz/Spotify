import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.scss';
import logoFacebook from '../../../../assets/images/icons8-facebook-30.png';
import logoApple from '../../../../assets/images/Apple-logo.png';
import logoGoogle from '../../../../assets/images/icons8-google-30.png';
import { AuthContext } from '../../../Auth';

export const HomePage: React.FC = () => {
	interface Auth {
		user: string;
		email: string;
		setEmail: (email: string) => void;
		setPassword: (password: string) => void;
		password: string;
		error: string;
		setRememberMe: (rememberMe: boolean) => void;
		handleLogin: () => void;
		rememberMe: boolean;
	}
	const { user, email, setEmail, setPassword, password, error, setRememberMe, handleLogin, rememberMe } = useContext(
		AuthContext
	) as Auth;

	return (
		<div className='container'>
			<div className='login-section'>
				<h1 className='title'>Spotify</h1>
				<p className='text-message'>Please sign in to Spotify to continue.</p>
				<div className='buttons'>
					<a className='button-facebook'>
						<img src={logoFacebook} />
						Sign in with Facebook
					</a>
					<a className='button-apple'>
						<img src={logoApple} />
						Sign in with Apple
					</a>
					<a className='button-google'>
						<img src={logoGoogle} />
						Sign in with Google
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
					<label className='input-text-password'>
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
							<input onClick={event => setRememberMe(!rememberMe)} className='checkbox-remember-me' type='checkbox' />
							<p>Remember me</p>
						</label>

						<button className='button-log-in'>Sign up</button>
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
