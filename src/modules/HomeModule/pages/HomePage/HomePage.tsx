import React from 'react';
import './HomePage.scss';
import logoFacebook from '../../../../assets/images/icons8-facebook-30.png';
import logoApple from '../../../../assets/images/icons8-apple-logo-30.png';
import logoGoogle from '../../../../assets/images/icons8-google-30.png';

export const HomePage: React.FC = () => {
	return (
		<div className='container'>
			<div className='login-section'>
				<h1 className='title'>Spotify</h1>
				<p className='text'>Please log in to Spotify to continue</p>
				<div className='buttons'>
					<button className='button-facebook'>
						<img src={logoFacebook} />
						Log in with facebook
					</button>
					<button className='button-apple'>
						<img src={logoApple} />
						Log in with Apple
					</button>
					<button className='button-google'>
						<img src={logoGoogle} />
						Log in with Google
					</button>
				</div>
				<p className='separator'>or</p>
				<form className='form-log-in'>
					<label className='input-text'>
						Email adress or username
						<input placeholder='Email adress or username' />
					</label>
					<label className='input-text'>
						Password
						<input placeholder='Password' />
					</label>
				</form>
				<a href='#' className='reset-password-link'>
					Do not you remember the password?
				</a>
				<div className='login'>
					<label className='input-remember-me'>
						<input className='checkbox-remember-me' type='checkbox' />
						<p>Remember me</p>
					</label>
					<button className='button-log-in'>Log in</button>
				</div>
				<div>
					<h2 className='text'>You dont have account yet?</h2>
					<button className='button-register'>Sign up for spotify</button>
				</div>
			</div>
		</div>
	);
};
