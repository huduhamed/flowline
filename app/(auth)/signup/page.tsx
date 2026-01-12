'use client';

import { signUpUser } from '../../../actions/auth';

function SignupForm() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
				<form action={signUpUser} className="space-y-4">
					<input
						name="email"
						type="email"
						required
						placeholder="Email"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<input
						name="password"
						type="password"
						required
						placeholder="Password"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition"
					>
						Sign Up
					</button>
				</form>
				<p className="text-center mt-4 text-gray-600">
					Already have an account?{' '}
					<a href="/signin" className="text-blue-500 hover:underline">
						Sign in
					</a>
				</p>
			</div>
		</div>
	);
}

export default SignupForm;
