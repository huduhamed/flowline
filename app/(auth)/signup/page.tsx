import { signUpUser } from '../actions';

export default function RegisterPage() {
	return (
		<div className="max-w-sm mx-auto mt-20">
			<h1 className="text-xl font-semibold mb-4">Create an account</h1>

			<form action={signUpUser} className="space-y-4">
				<input
					name="email"
					type="email"
					placeholder="Email"
					className="w-full border rounded p-2"
					required
				/>

				<input
					name="password"
					type="password"
					placeholder="Password"
					className="w-full border rounded p-2"
					required
				/>

				<button type="submit" className="w-full bg-black text-white rounded p-2">
					Register
				</button>
			</form>
		</div>
	);
}
