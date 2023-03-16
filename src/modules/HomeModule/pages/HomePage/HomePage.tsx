import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.scss';
import logoFacebook from '../../../../assets/images/icons8-facebook-30.png';
import logoApple from '../../../../assets/images/Apple-logo.png';
import logoGoogle from '../../../../assets/images/icons8-google-30.png';
import { AuthContext } from '../../../Auth';

export const HomePage: React.FC = () => {
	interface Auth {
		email: string;
		setEmail: (email: string) => void;
		setPassword: (password: string) => void;
		password: string;
		error: string;
		setRememberMe: (rememberMe: boolean) => void;
		handleLogin: () => void;
		rememberMe: boolean;
	}
	const { email, setEmail, setPassword, password, error, setRememberMe, handleLogin, rememberMe } = useContext(
		AuthContext
	) as Auth;

	return (
		<div className='home-page'>
			<div className='home-page__login-section'>
				<h1 className='home-page__login-section__title'>Spotify</h1>
				<p className='home-page__login-section__text-message'>Please sign in to Spotify to continue.</p>
				<div className='home-page__login-section__buttons'>
					<a className='home-page__login-section__buttons__button home-page__login-section__buttons__button--facebook'>
						<img src={logoFacebook} />
						Sign in with Facebook
					</a>
					<a className='home-page__login-section__buttons__button home-page__login-section__buttons__button--apple'>
						<img src={logoApple} />
						Sign in with Apple
					</a>
					<a className='home-page__login-section__buttons__button home-page__login-section__buttons__button--google'>
						<img src={logoGoogle} />
						Sign in with Google
					</a>
				</div>
				<p className='home-page__login-section__separator'>or</p>
				<form className='home-page__login-section__form-log-in' onSubmit={handleLogin}>
					<label className='home-page__login-section__input-text'>
						Email address or username
						<input
							placeholder='Email address or username'
							value={email}
							onChange={event => setEmail(event.target.value)}
						/>
					</label>
					<label className='home-page__login-section__input-text-password'>
						Password
						<input
							placeholder='Password'
							type='password'
							value={password}
							onChange={event => setPassword(event.target.value)}
						/>
					</label>
					<a href='#' className='home-page__login-section__reset-password-link'>
						Do not you remember the password?
					</a>
					{error && <p className='home-page__login-section__error'>{error}</p>}
					<div className='home-page__login-section__login'>
						<label className='home-page__login-section__login__remember-me'>
							<input
								onClick={() => setRememberMe(!rememberMe)}
								className='home-page__login-section__login__remember-me__checkbox'
								type='checkbox'
							/>
							<p>Remember me</p>
						</label>
						<button className='home-page__login-section__login__button-log-in'>Sign up</button>
					</div>
				</form>
				<div>
					<a href='#' className='home-page__login-section__text'>
						You dont have account yet?
					</a>
					<Link to='/register'>
						<button className='home-page__login-section__button-register'>Sign up for spotify</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
