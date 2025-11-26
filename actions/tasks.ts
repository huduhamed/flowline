'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { TaskStatus } from '@prisma/client';

type CreateTaskInput = {
	title: string;
	description?: string | null;
};

export async function createTask(input: CreateTaskInput): Promise<void> {
	const session = await auth();

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	const title = input.title.trim();

	if (!title) {
		throw new Error('Title is required');
	}

	await prisma.task.create({
		data: {
			title,
			description: input.description ?? null,
			userId: session.user.id,
		},
	});

	revalidatePath('/dashboard/tasks');
}

export async function deleteTask(taskId: string): Promise<void> {
	const session = await auth();

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	await prisma.task.deleteMany({
		where: {
			id: taskId,
			userId: session.user.id,
		},
	});

	revalidatePath('/dashboard/tasks');
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
	const session = await auth();

	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}

	await prisma.task.updateMany({
		where: {
			id: taskId,
			userId: session.user.id,
		},
		data: {
			status,
		},
	});

	revalidatePath('/dashboard/tasks');
}
