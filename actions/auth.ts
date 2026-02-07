'use server';

import { hash, compare } from 'bcrypt';
import { redirect } from 'next/navigation';

// internal imports
import { prisma } from '../lib/prisma';
import { signIn, auth } from '../lib/auth';

type ActionResult = { success: true } | { success: false; error: string };

// Require user
async function requireUser() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}
	return session.user.id;
}

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

// update user profile
export async function updateUserProfile({ name }: { name: string }): Promise<ActionResult> {
	try {
		const userId = await requireUser();

		await prisma.user.update({
			where: { id: userId },
			data: { name },
		});

		return { success: true };
	} catch (error) {
		console.error('Update profile error:', error);
		return { success: false, error: 'Failed to update profile' };
	}
}

// change password
export async function changePassword({
	currentPassword,
	newPassword,
}: {
	currentPassword: string;
	newPassword: string;
}): Promise<ActionResult> {
	try {
		const userId = await requireUser();

		// Get current user password
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { password: true },
		});

		if (!user) {
			return { success: false, error: 'User not found' };
		}

		// Verify current password
		const isValid = await compare(currentPassword, user.password);
		if (!isValid) {
			return { success: false, error: 'Current password is incorrect' };
		}

		// Hash new password
		const hashedPassword = await hash(newPassword, 10);

		// Update password
		await prisma.user.update({
			where: { id: userId },
			data: { password: hashedPassword },
		});

		return { success: true };
	} catch (error) {
		console.error('Change password error:', error);
		return { success: false, error: 'Failed to change password' };
	}
}

// delete account
export async function deleteAccount(): Promise<ActionResult> {
	try {
		const userId = await requireUser();

		// Delete user and related tasks (cascade)
		await prisma.user.delete({
			where: { id: userId },
		});

		// Redirect to home page (user will be logged out automatically)
		redirect('/');
	} catch (error) {
		console.error('Delete account error:', error);
		return { success: false, error: 'Failed to delete account' };
	}
}
