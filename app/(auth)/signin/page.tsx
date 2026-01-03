import { signInUser } from '../../../actions/auth';

function SignInForm() {
	return (
		<form action={signInUser}>
			<input name="email" type="email" required />
			<input name="password" type="password" required />
			<button type="submit">Sign in Page</button>
		</form>
	);
}

export default SignInForm;
