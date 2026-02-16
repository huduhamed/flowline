'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type TaskAccessRole = 'VIEWER' | 'EDITOR' | 'OWNER';

type ActionResult = { success: true } | { success: false; error: string };

async function requireUser() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}
	return session.user.id;
}

// TODO: Uncomment after Prisma migration
// export async function shareTask(
// 	taskId: string,
// 	recipientEmail: string,
// 	role: TaskAccessRole = 'VIEWER',
// ): Promise<ActionResult> {
// 	const userId = await requireUser();
//
// 	try {
// 		// Verify task belongs to user
// 		const task = await prisma.task.findFirst({
// 			where: {
// 				id: taskId,
// 				userId,
// 			},
// 		});
//
// 		if (!task) {
// 			return { success: false, error: 'Task not found' };
// 		}
//
// 		// Find recipient user
// 		const recipient = await prisma.user.findUnique({
// 			where: { email: recipientEmail },
// 		});
//
// 		if (!recipient) {
// 			return { success: false, error: 'User not found' };
// 		}
//
// 		if (recipient.id === userId) {
// 			return { success: false, error: 'Cannot share task with yourself' };
// 		}
//
// 		// Create or update share
// 		await prisma.taskShare.upsert({
// 			where: {
// 				taskId_sharedWithUserId: {
// 					taskId,
// 					sharedWithUserId: recipient.id,
// 				},
// 			},
// 			update: { role },
// 			create: {
// 				taskId,
// 				sharedWithUserId: recipient.id,
// 				role,
// 			},
// 		});
//
// 		revalidatePath('/dashboard/tasks');
// 		return { success: true };
// 	} catch (error) {
// 		const message = error instanceof Error ? error.message : 'Failed to share task';
// 		return { success: false, error: message };
// 	}
// }

export async function shareTask(): Promise<ActionResult> {
	return { success: false, error: 'Task sharing not yet available' };
}

// TODO: Uncomment after migration
// export async function unshareTask(taskId: string, recipientUserId: string): Promise<ActionResult> {
// 	const userId = await requireUser();
// 	try {
// 		// Verify task belongs to user
// 		const task = await prisma.task.findFirst({
// 			where: {
// 				id: taskId,
// 				userId,
// 			},
// 		});
// 		if (!task) {
// 			return { success: false, error: 'Task not found' };
// 		}
// 		await prisma.taskShare.deleteMany({
// 			where: {
// 				taskId,
// 				sharedWithUserId: recipientUserId,
// 			},
// 		});
// 		revalidatePath('/dashboard/tasks');
// 		return { success: true };
// 	} catch {
// 		return { success: false, error: 'Failed to unshare task' };
// 	}
// }

export async function unshareTask(): Promise<ActionResult> {
	return { success: false, error: 'Task unsharing not yet available' };
}

// TODO: Uncomment after migration
// export async function getTaskShares(taskId: string) {
// 	const userId = await requireUser();
// 	try {
// 		const task = await prisma.task.findFirst({
// 			where: { id: taskId, userId },
// 		});
// 		if (!task) {
// 			return { success: false, error: 'Task not found', shares: [] };
// 		}
// 		const shares = await prisma.taskShare.findMany({
// 			where: { taskId },
// 			include: {
// 				sharedWith: {
// 					select: { id: true, email: true, name: true },
// 				},
// 			},
// 		});
// 		return { success: true, shares };
// 	} catch {
// 		return { success: false, error: 'Failed to fetch shares', shares: [] };
// 	}
// }

export async function getTaskShares() {
	return { success: false, error: 'Sharing info not yet available', shares: [] };
}

// TODO: Uncomment after migration
// export async function getSharedWithMeTasks() {
// 	const userId = await requireUser();
// 	try {
// 		const sharedTasks = await prisma.taskShare.findMany({
// 			where: { sharedWithUserId: userId },
// 			include: {
// 				task: {
// 					include: {
// 						user: {
// 							select: { id: true, email: true, name: true },
// 						},
// 					},
// 				},
// 			},
// 		});
// 		return { success: true, sharedTasks };
// 	} catch {
// 		return { success: false, error: 'Failed to fetch shared tasks', sharedTasks: [] };
// 	}
// }

export async function getSharedWithMeTasks() {
	return { success: false, error: 'Shared tasks not yet available', sharedTasks: [] };
}

// TODO: Uncomment after migration
// export async function updateSharedTaskAccess(
// 	taskId: string,
// 	recipientUserId: string,
// 	newRole: TaskAccessRole,
// ): Promise<ActionResult> {
// 	const userId = await requireUser();
// 	try {
// 		const task = await prisma.task.findFirst({
// 			where: { id: taskId, userId },
// 		});
// 		if (!task) {
// 			return { success: false, error: 'Task not found' };
// 		}
// 		await prisma.taskShare.update({
// 			where: {
// 				taskId_sharedWithUserId: {
// 					taskId,
// 					sharedWithUserId: recipientUserId,
// 				},
// 			},
// 			data: { role: newRole },
// 		});
// 		revalidatePath('/dashboard/tasks');
// 		return { success: true };
// 	} catch {
// 		return { success: false, error: 'Failed to update access' };
// 	}
// }

export async function updateSharedTaskAccess(): Promise<ActionResult> {
	return { success: false, error: 'Access updates not yet available' };
}
