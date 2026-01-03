'use client';

import { signUpUser } from '../../../actions/auth';

function SignupForm() {
	return (
		<form action={signUpUser}>
			<input name="email" type="email" required />
			<input name="password" type="password" required />
			<button type="submit">Sign up Page</button>
		</form>
	);
}

export default SignupForm;
