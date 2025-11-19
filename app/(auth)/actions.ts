'use server';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

// sign up
export async function signUpUser(_: any, formData: FormData) {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	if (!email || !password) return;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) throw new Error('Email already exists');

	const hashed = await hash(password, 10);

	await prisma.user.create({
		data: { email, password: hashed },
	});

	redirect('/signin');
}

// login
export async function signInUser(_: any, formData: FormData) {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	await signIn('credentials', {
		email,
		password,
		redirectTo: '/dashboard',
	});
}
