import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.scss';
import logoFacebook from '../../../../assets/images/icons8-facebook-30.png';
import logoApple from '../../../../assets/images/Apple-logo.png';
import logoGoogle from '../../../../assets/images/icons8-google-30.png';
import { AuthContext } from '../../../ContextApi/Auth';
import { auth } from '@/modules/firebase.js';
import { signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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
export const LoginPage: React.FC = () => {
	const { email, setEmail, setPassword, password, error, setRememberMe, handleLogin, rememberMe } = useContext(
		AuthContext
	) as Auth;
	const navigate = useNavigate();

	const signInWithFacebook = async () => {
		const provider = new FacebookAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			navigate('/homepage');
		} catch (error) {
			console.error('Error during Facebook sign in', error);
		}
	};

	const signInWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			navigate('/homepage');
		} catch (error) {
			console.error('Error during Google sign in', error);
		}
	};

	const signInWithApple = async () => {
		const provider = new OAuthProvider('apple.com');
		try {
			await signInWithPopup(auth, provider);
			navigate('/homepage');
		} catch (error) {
			console.error('Error during Apple sign in', error);
		}
	};

	return (
		<div className='login-page'>
			<div className='login-section'>
				<h1 className='login-section__title'>Spotify</h1>
				<p className='login-section__text-message'>Please sign in to Spotify to continue.</p>
				<div className='login-section__buttons'>
					<button
						onClick={signInWithFacebook}
						className='login-section__buttons__button login-section__buttons__button--facebook'>
						<img src={logoFacebook} />
						Sign in with Facebook
					</button>
					<button
						onClick={signInWithApple}
						className='login-section__buttons__button login-section__buttons__button--apple'>
						<img src={logoApple} />
						Sign in with Apple
					</button>
					<button
						onClick={signInWithGoogle}
						className='login-section__buttons__button login-section__buttons__button--google'>
						<img src={logoGoogle} />
						Sign in with Google
					</button>
				</div>
				<p className='login-section__separator'>or</p>
				<form className='login-section__form-log-in' onSubmit={handleLogin}>
					<label className='login-section__input-text'>
						Email address or username
						<input
							placeholder='Email address or username'
							value={email}
							onChange={event => setEmail(event.target.value)}
						/>
					</label>
					<label className='login-section__input-text-password'>
						Password
						<input
							placeholder='Password'
							type='password'
							value={password}
							onChange={event => setPassword(event.target.value)}
						/>
					</label>
					<a href='#' className='login-section__reset-password-link'>
						Do not you remember the password?
					</a>
					{error && <p className='login-section__error'>{error}</p>}
					<div className='login-section__login'>
						<label className='login-section__login__remember-me'>
							<input
								onClick={() => setRememberMe(!rememberMe)}
								className='login-section__login__remember-me__checkbox'
								type='checkbox'
							/>
							<p>Remember me</p>
						</label>
						<div className='login-section__login__buttons'>
							<button disabled={!email || !password} className='login-section__login__button-log-in'>
								Sign in
							</button>
							<button
								onClick={() => {
									setEmail('test@test.com');
									setPassword('Test123');
								}}
								className='login-section__login__button-test'>
								Click for quick log in
							</button>
						</div>
					</div>
				</form>
				<div>
					<a href='#' className='login-section__text'>
						You dont have account yet?
					</a>
					<Link to='/register'>
						<button className='login-section__button-register'>Sign up for spotify</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
