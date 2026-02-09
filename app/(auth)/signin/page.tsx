'use client';

import { useState, useTransition } from 'react';

// internal imports
import { useToast } from '@/lib/toast-context';
import { signInUser } from '@/actions/auth';

function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [pending, startTransition] = useTransition();
	const { addToast } = useToast();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// validation
		if (!email.trim() || !password.trim()) {
			addToast('Please enter both email and password', 'error');
			return;
		}

		if (!email.includes('@')) {
			addToast('Please enter a valid email', 'error');
			return;
		}

		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.set('email', email);
				formData.set('password', password);

				await signInUser(formData);
			} catch (error) {
				if (error instanceof Error) {
					addToast(error.message, 'error');
				} else {
					addToast('Failed to sign in', 'error');
				}
			}
		});
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button
						type="submit"
						disabled={pending}
						className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{pending ? 'Signing In...' : 'Sign In'}
					</button>
				</form>
				<p className="text-center mt-4 text-gray-600">
					Don&apos;t have an account?{' '}
					<a href="/signup" className="text-blue-500 hover:underline">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
}

export default SignInForm;
