'use client';

import { useState } from 'react';
import { useToast } from '@/lib/toast-context';
import { signUpUser } from '@/actions/auth';
import { useRouter } from 'next/navigation';

function SignupForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { addToast } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// validation
		if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
			addToast('Please fill in all fields', 'error');
			return;
		}

		if (!email.includes('@')) {
			addToast('Please enter a valid email', 'error');
			return;
		}

		if (password.length < 6) {
			addToast('Password must be at least 6 characters', 'error');
			return;
		}

		if (password !== confirmPassword) {
			addToast('Passwords do not match', 'error');
			return;
		}

		setLoading(true);

		try {
			const formData = new FormData();
			formData.set('email', email);
			formData.set('password', password);

			await signUpUser(formData);
			addToast('Account created successfully! Redirecting to sign in...', 'success');
		} catch (error) {
			if (error instanceof Error) {
				addToast(error.message, 'error');
			} else {
				addToast('Failed to create account', 'error');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							name="email"
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
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Confirm Password</label>
						<input
							name="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm your password"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Creating Account...' : 'Sign Up'}
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
