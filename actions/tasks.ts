'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { TaskStatus } from '@prisma/client';

type ActionResult = { success: true } | { success: false; error: string };

// require user
async function requireUser() {
	const session = await auth();

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	return session.user.id;
}

// create task
export async function createTask(
	_: ActionResult | null,
	formData: FormData
): Promise<ActionResult> {
	const userId = await requireUser();

	const title = formData.get('title');
	const description = formData.get('description');

	if (typeof title !== 'string' || title.trim().length === 0) {
		return { success: false, error: 'Title is required' };
	}

	await prisma.task.create({
		data: {
			title,
			description: typeof description === 'string' ? description : null,
			userId,
		},
	});

	revalidatePath('/dashboard/tasks');

	return { success: true };
}

// delete task
export async function deleteTask(taskId: string): Promise<ActionResult> {
	const userId = await requireUser();

	await prisma.task.deleteMany({
		where: {
			id: taskId,
			userId,
		},
	});

	revalidatePath('/dashboard/tasks');

	return { success: true };
}

// update task status
export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<ActionResult> {
	const userId = await requireUser();

	await prisma.task.updateMany({
		where: {
			id: taskId,
			userId,
		},
		data: {
			status,
		},
	});

	revalidatePath('/dashboard/tasks');

	return { success: true };
}
