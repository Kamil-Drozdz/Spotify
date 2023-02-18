import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.js';
import './RegisterPage.scss';

interface FormValues {
	displayName: string;
	email: string;
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
		password: '',
		dobMonth: '',
		dobDay: '',
		dobYear: '',
		marketingConsent: false,
		gender: '',
	});
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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const user = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);
			const userCurrent: any = auth.currentUser;
			const userName = await updateProfile(userCurrent, { displayName: formValues.displayName }).catch(err =>
				console.log(err)
			);
			navigate('/');
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<div className='container'>
			<div className='register-section'>
				<form onSubmit={handleSubmit}>
					<label htmlFor='displayName'>Whats your name?</label>
					<input
						type='text'
						id='displayName'
						placeholder='Enter your name'
						name='displayName'
						value={formValues.displayName}
						onChange={handleChange}
					/>
					<label htmlFor='email'>Whats your email?</label>
					<input
						placeholder='Enter your email'
						type='email'
						id='email'
						name='email'
						value={formValues.email}
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

					<label htmlFor='dob-month'>Whats your date of birth?</label>
					<div className='dob-inputs'>
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

						<input
							type='number'
							id='dob-day'
							name='dobDay'
							placeholder='DD'
							min='0'
							value={formValues.dobDay}
							onChange={handleChange}
						/>

						<input
							type='number'
							id='dob-year'
							name='dobYear'
							placeholder='YYYY'
							value={formValues.dobYear}
							onChange={handleChange}
						/>
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
								Unanswered
							</label>
						</div>
					</div>
					<p className='error'>{error}</p>
					<button type='submit'>Register</button>
				</form>
			</div>
		</div>
	);
};
