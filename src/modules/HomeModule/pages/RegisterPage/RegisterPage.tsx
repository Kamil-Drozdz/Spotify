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
	info?: string;
}

export const RegisterPage: React.FC = () => {
	const [error, setError] = useState<FormValues>({
		displayName: '',
		email: '',
		confirmEmail: '',
		password: '',
		dobMonth: '',
		dobDay: '',
		dobYear: '',
		marketingConsent: false,
		gender: '',
		info: '',
	});

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
		info: '',
	});
	let errorMsg = '';
	const MIN_DISPLAYNAME_LENGTH = 3;
	const MIN_PASSWORD_LENGTH = 6;
	const PASSWORD_PATTERN = /^(?=.*[A-Z]).{6,}$/;
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
			if (name === 'dobDay' || name === 'dobMonth' || name === 'dobYear') {
				const currentDate = new Date();
				const currentYear = currentDate.getFullYear();
				const minYear = currentYear - 100;
				const maxYear = currentYear;
				const day = name === 'dobDay' ? value : formValues.dobDay;
				const month = name === 'dobMonth' ? value : formValues.dobMonth;
				const year = name === 'dobYear' ? value : formValues.dobYear;
				const dateOfBirth = new Date(Number(year), Number(month) - 1, Number(day));
				const typeYear = Number(year);
				if (typeYear < minYear || typeYear > maxYear) {
					errorMsg = `Please enter a valid year between ${minYear} and ${maxYear}`;
				} else if (dateOfBirth > currentDate) {
					errorMsg = 'Please enter a valid date in the past';
				} else {
					errorMsg = '';
				}
			}
			if (name === 'gender') {
				if (value === '') {
					errorMsg = 'Please select a valid gender';
				} else {
					errorMsg = '';
				}
			}
			if (name === 'email') {
				const emailRegex = /^\S+@\S+\.\S+$/;
				if (!emailRegex.test(value) || '') {
					errorMsg = 'Please enter a valid email address';
				}
				// } else if (name === 'confirmEmail') {
				// 	if (value !== formValues.email) {
				// 		errorMsg = 'Email addresses do not match';
				// 	}
			} else if (name === 'password') {
				if (value.length < MIN_PASSWORD_LENGTH) {
					errorMsg = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
				} else if (!PASSWORD_PATTERN.test(value)) {
					errorMsg = 'Password must contain at least one uppercase letter';
				}
			} else if (name === 'displayName') {
				if (value.length < MIN_DISPLAYNAME_LENGTH) {
					errorMsg = `Name must be at least ${MIN_DISPLAYNAME_LENGTH} characters`;
				}
			} else {
				errorMsg = '';
			}

			setFormValues(prevValues => ({
				...prevValues,
				[name]: value,
			}));

			setError(prevErrors => ({
				...prevErrors,
				[name]: errorMsg,
			}));
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		try {
			const user = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);
			const userCurrent: any = auth.currentUser;
			const userName = await updateProfile(userCurrent, { displayName: formValues.displayName });

			toast.success('account has been created, log in');
			setTimeout(() => {
				navigate('/');
			}, 2500);
		} catch (error: any) {
			setError(prevErrors => ({
				...prevErrors,
				info: error.message,
			}));
		}
		setIsLoading(false);
	};

	return (
		<div className='register-page'>
			<div className='register-section'>
				<h1 className='register-section__title'>Spotify</h1>
				<p className='register-section__text-message'>Sign up for free to start listening.</p>
				<div className='register-section__buttons'>
					<a className='register-section__button--facebook'>
						<img src={logoFacebook} />
						Sign in with Facebook
					</a>
					<a className='register-section__button--google'>
						<img src={logoGoogle} />
						Sign in with Google
					</a>
				</div>
				<p className='register-section__separator'>or</p>
				<a href='#' className='register-section__button-log-in'>
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
					<p className='register-section__input-error'>{error.email}</p>
					{/* <label htmlFor='confirmEmail'>Confirm your email</label>
					<input
						placeholder='Enter your email again'
						type='email'
						id='confirmEmail'
						name='confirmEmail'
						value={formValues.confirmEmail}
						onChange={handleChange}
					/>
					<p className='register-section__input-error'>{error.confirmEmail}</p> */}
					<label htmlFor='password'>Password</label>
					<input
						placeholder='Enter your password'
						type='password'
						id='password'
						name='password'
						value={formValues.password}
						onChange={handleChange}
						minLength={MIN_PASSWORD_LENGTH}
					/>
					<p className='register-section__input-error'>{error.password}</p>
					<label htmlFor='displayName'>What should we call you</label>
					<input
						type='text'
						id='displayName'
						placeholder='Enter a profile name'
						name='displayName'
						value={formValues.displayName}
						onChange={handleChange}
						minLength={MIN_DISPLAYNAME_LENGTH}
					/>
					<p className='register-section__input-error'>{error.displayName}</p>
					<p className='register-section__info'>This appears on your profile</p>
					<label className='register-section__info-birth' htmlFor='dob-month'>
						Whats your date of birth?
					</label>
					<div className='register-section__dob-inputs'>
						<label className='register-section__input-date' htmlFor='dob-month'>
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
						<label className='register-section__input-date' htmlFor='dob-day'>
							Day
						</label>
						<input
							type='number'
							id='dob-day'
							name='dobDay'
							min='0'
							max='31'
							placeholder='DD'
							value={formValues.dobDay}
							onChange={handleChange}
						/>
						<label className='register-section__input-date' htmlFor='dob-year'>
							Year
						</label>
						<input
							type='number'
							id='dob-year'
							name='dobYear'
							min='1900'
							max='2050'
							placeholder='YYYY'
							value={formValues.dobYear}
							onChange={handleChange}
						/>
					</div>
					<p className='register-section__input-error'>{error.dobDay || error.dobMonth || error.dobYear}</p>
					<label htmlFor='gender'>Whats your gender?</label>
					<div>
						<div className='register-section__radio-buttons'>
							<label>
								<input
									type='radio'
									id='male'
									name='gender'
									value='male'
									checked={formValues.gender === 'male'}
									onChange={handleChange}
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
								/>
								Other
							</label>
							<p className='register-section__input-error'>{error.gender}</p>
						</div>
					</div>

					<div className='register-section__form-checkbox'>
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
						<p className='register-section__input-error'>{error.marketingConsent}</p>
					</div>
					<p className='register-section__info-terms'>
						By clicking on sing-up. you afree to Spotifys
						<a className='register-section__info-terms-anchor' href='#'>
							Terms and Conditions of Use.
						</a>
					</p>
					<p className='register-section__info-terms'>
						To learn more about how. Spotify collects,uses,shares, and proctects your personal data,please see
						<a className='register-section__info-terms-anchor' href='#'>
							Spotifys Privacy Policy.
						</a>
					</p>

					<p className='register-section__error'>{error.info}</p>
					{isLoading ? (
						<div className='register-section__spinner'>
							<RotatingLines strokeColor='green' strokeWidth='5' animationDuration='0.55' width='48' visible={true} />
						</div>
					) : (
						<button
							disabled={
								!!error.displayName ||
								!!error.email ||
								!!error.gender ||
								!!error.confirmEmail ||
								!!error.password ||
								!formValues.displayName ||
								!formValues.email ||
								// !formValues.confirmEmail ||
								!formValues.password ||
								!formValues.dobDay ||
								!formValues.dobMonth ||
								!formValues.dobYear ||
								!formValues.gender
							}
							className='register-section__submit-button'
							type='submit'>
							Sign up
						</button>
					)}
				</form>
				<p className='register-section__login'>
					Have an account?
					<a
						className='register-section__login--link'
						onClick={() => {
							navigate('/');
						}}>
						log in
					</a>
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
