'use server';

import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

// sign in page
export async function signInUser(formData: FormData) {
	const email = formData.get('email');
	const password = formData.get('password');

	// if not email or password
	if (!email || !password) {
		throw new Error('Missing credentials');
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirect: false,
		});
	} catch (error) {
		return {
			error: 'Invalid email or password',
		};
	}

	redirect('/dashboard');
}
