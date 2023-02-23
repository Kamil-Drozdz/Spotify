import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import logoFacebook from '../../../../assets/images/icons8-facebook-30.png';
import logoGoogle from '../../../../assets/images/icons8-google-30.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.js';
import './RegisterPage.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RotatingLines } from 'react-loader-spinner';

interface FormValues {
	displayName: string;
	email: string;
	confirmEmail: string;
	password: string;
	dobMonth: string;
	dobDay: string;
	dobYear: string;
	marketingConsent: boolean;
	gender: string;
}

export const RegisterPage: React.FC = () => {
	const [error, setError] = useState('');
	const [formValues, setFormValues] = useState<FormValues>({
		displayName: '',
		email: '',
		confirmEmail: '',
		password: '',
		dobMonth: '',
		dobDay: '',
		dobYear: '',
		marketingConsent: false,
		gender: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value, type, checked } = event.target as HTMLInputElement;

		if (type === 'checkbox') {
			setFormValues(prevValues => ({
				...prevValues,
				[name]: checked,
			}));
		} else {
			setFormValues(prevValues => ({
				...prevValues,
				[name]: value,
			}));
		}
	};
	function handleLoginClick() {
		navigate('/');
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (formValues.email !== formValues.confirmEmail) {
			setError('Email and confirm email must match');
			return;
		}
		setIsLoading(true);
		try {
			const user = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);
			const userCurrent: any = auth.currentUser;
			const userName = await updateProfile(userCurrent, { displayName: formValues.displayName }).catch(err =>
				console.log(err)
			);
			toast.success('account has been created, log in');
			setTimeout(() => {
				navigate('/');
			}, 2500);
		} catch (error: any) {
			setError(error.message);
		}
		setIsLoading(false);
	};

	return (
		<div className='container'>
			<div className='register-section'>
				<h1 className='title'>Spotify</h1>
				<p className='text-message'>Sign up for free to start listening.</p>
				<div className='buttons'>
					<a className='button-facebook'>
						<img src={logoFacebook} />
						Sign in with Facebook
					</a>
					<a className='button-google'>
						<img src={logoGoogle} />
						Sign in with Google
					</a>
				</div>
				<p className='separator'>or</p>
				<a href='#' className='button-log-in'>
					Sign up wiuth your email adress
				</a>
				<form onSubmit={handleSubmit}>
					<label htmlFor='email'>Whats your email?</label>
					<input
						placeholder='Enter your email'
						type='email'
						id='email'
						name='email'
						value={formValues.email}
						onChange={handleChange}
					/>
					<label htmlFor='confirmEmail'>Confirm your email</label>
					<input
						placeholder='Enter your email again'
						type='email'
						id='confirmEmail'
						name='confirmEmail'
						value={formValues.confirmEmail}
						onChange={handleChange}
					/>
					<label htmlFor='password'>Password</label>
					<input
						placeholder='Enter your password'
						type='password'
						id='password'
						name='password'
						value={formValues.password}
						onChange={handleChange}
					/>
					<label htmlFor='displayName'>What should we call you</label>
					<input
						type='text'
						id='displayName'
						placeholder='Enter a profile name'
						name='displayName'
						value={formValues.displayName}
						onChange={handleChange}
					/>
					<p className='info'>This appears on your profile</p>

					<label className='info-birth' htmlFor='dob-month'>
						Whats your date of birth?
					</label>
					<div className='dob-inputs'>
						<label className='input-date' htmlFor='dob-month'>
							Month
						</label>
						<select id='dob-month' name='dobMonth' value={formValues.dobMonth} onChange={handleChange}>
							<option value='' disabled>
								Month
							</option>
							<option value='1'>January</option>
							<option value='2'>February</option>
							<option value='3'>March</option>
							<option value='4'>April</option>
							<option value='5'>May</option>
							<option value='6'>June</option>
							<option value='7'>July</option>
							<option value='8'>August</option>
							<option value='9'>September</option>
							<option value='10'>October</option>
							<option value='11'>November</option>
							<option value='12'>December</option>
						</select>
						<label className='input-date' htmlFor='dob-day'>
							Day
						</label>
						<input
							type='number'
							id='dob-day'
							name='dobDay'
							placeholder='DD'
							min='0'
							value={formValues.dobDay}
							onChange={handleChange}
							required
						/>
						<label className='input-date' htmlFor='dob-year'>
							Year
						</label>
						<input
							type='number'
							id='dob-year'
							name='dobYear'
							placeholder='YYYY'
							value={formValues.dobYear}
							onChange={handleChange}
							required
						/>
					</div>

					<label htmlFor='gender'>Whats your gender?</label>
					<div>
						<div className='radio-buttons'>
							<label>
								<input
									type='radio'
									id='male'
									name='gender'
									value='male'
									checked={formValues.gender === 'male'}
									onChange={handleChange}
									required
								/>
								Male
							</label>
							<label>
								<input
									type='radio'
									id='female'
									name='gender'
									value='female'
									checked={formValues.gender === 'female'}
									onChange={handleChange}
									required
								/>
								Female
							</label>
							<label>
								<input
									type='radio'
									id='non-binary'
									name='gender'
									value='non-binary'
									checked={formValues.gender === 'non-binary'}
									onChange={handleChange}
									required
								/>
								Non-binary
							</label>
							<label>
								<input
									type='radio'
									id='other'
									name='gender'
									value='other'
									checked={formValues.gender === 'other'}
									onChange={handleChange}
									required
								/>
								Other
							</label>
						</div>
					</div>

					<div className='form-checkbox'>
						<input
							type='checkbox'
							min='0'
							id='marketing-checkbox'
							name='marketingConsent'
							checked={formValues.marketingConsent}
							onChange={handleChange}
						/>
						<label htmlFor='marketing-checkbox'>
							Share my registration date with Spotifys content providers for marketing purposes.
						</label>
					</div>
					<p className='info-terms'>
						By clicking on sing-up. you afree to Spotifys{' '}
						<a className='info-terms-anchor' href='#'>
							Terms and Conditions of Use.
						</a>
					</p>
					<p className='info-terms'>
						To learn more about how. Spotify collects,uses,shares, and proctects your personal data,please see{' '}
						<a className='info-terms-anchor' href='#'>
							Spotifys Privacy Policy.
						</a>
					</p>

					<p className='error'>{error}</p>
					{isLoading ? (
						<div className='spinner'>
							<RotatingLines strokeColor='green' strokeWidth='5' animationDuration='0.55' width='48' visible={true} />
						</div>
					) : (
						<button className='submit-button' type='submit'>
							Sign up
						</button>
					)}
				</form>
				<p className='login-link'>
					Have an account? <a onClick={handleLoginClick}>log in</a>
				</p>
			</div>
			<ToastContainer
				position='bottom-left'
				autoClose={1500}
				hideProgressBar={false}
				limit={1}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
			/>
		</div>
	);
};
