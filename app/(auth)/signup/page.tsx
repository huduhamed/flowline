'use server';

import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { hash, compare } from 'bcryptjs';

// fix later
import { db } from '@/lib/db';

export async function signUpUser(formData: FormData) {
	const email = formData.get('email');
	const password = formData.get('password');

	if (!email || !password) {
		throw new Error('Missing credentials');
	}

	// check if user exists
	const existingUser = await db.user.findUnique({
		where: { email: email.toString() },
	});

	if (existingUser) {
		return {
			error: 'User already exists',
		};
	}

	// Hash password
	const hashedPassword = await hash(password.toString(), 12);

	// Create user
	await db.user.create({
		data: {
			email: email.toString(),
			password: hashedPassword,
		},
	});

	// Auto sign-in
	await signIn('credentials', {
		email,
		password,
		redirect: false,
	});

	redirect('/dashboard');
}
