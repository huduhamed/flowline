'use server';

import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';

// internal imports
import { prisma } from '../lib/prisma';
import { signIn } from '../lib/auth';

// sign up
export async function signUpUser(formData: FormData) {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	if (!email || !password) return 'Please enter your credentials correctly.';

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) throw new Error('Email already exists');

	const hashed = await hash(password, 10);

	await prisma.user.create({
		data: { email, password: hashed },
	});

	redirect('/signin');
}

// login
export async function signInUser(formData: FormData) {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	await signIn('credentials', {
		email,
		password,
		redirectTo: '/dashboard',
	});
}
