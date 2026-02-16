'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type RecurrencePattern = string;

type ActionResult = { success: true } | { success: false; error: string };

async function requireUser() {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error('Unauthorized');
	}
	return session.user.id;
}

// TODO: Uncomment after Prisma migration
// export async function createRecurringTask(
// 	title: string,
// 	description: string | null,
// 	recurrencePattern: RecurrencePattern,
// 	recurrenceEndDate: Date | null,
// ): Promise<ActionResult> {
// 	const userId = await requireUser();

// 	try {
// 		const task = await prisma.task.create({
// 			data: {
// 				title,
// 				description,
// 				recurrence: recurrencePattern,
// 				recurrenceEndDate,
// 				userId,
// 			},
// 		});

// 		return { success: true };
// 	} catch {
// 		return { success: false, error: 'Failed to create recurring task' };
// 	}
// }

// export async function updateRecurrence(
// 	taskId: string,
// 	recurrencePattern: RecurrencePattern | null,
// 	recurrenceEndDate: Date | null,
// ): Promise<ActionResult> {
// 	const userId = await requireUser();

// 	try {
// 		await prisma.task.updateMany({
// 			where: {
// 				id: taskId,
// 				userId,
// 			},
// 			data: {
// 				recurrence: recurrencePattern,
// 				recurrenceEndDate,
// 			},
// 		});

// 		return { success: true };
// 	} catch {
// 		return { success: false, error: 'Failed to update recurrence' };
// 	}
// }

// export async function getRecurringInstances(taskId: string) {
// 	const userId = await requireUser();

// 	try {
// 		// Get the parent task
// 		const parentTask = await prisma.task.findFirst({
// 			where: {
// 				id: taskId,
// 				userId,
// 			},
// 		});

// 		if (!parentTask) {
// 			return { success: false, error: 'Task not found' };
// 		}

// 		// Get all child instances of this recurring task
// 		const instances = await prisma.task.findMany({
// 			where: {
// 				parentTaskId: taskId,
// 				userId,
// 			},
// 			orderBy: { dueDate: 'asc' },
// 		});

// 		return { success: true, parentTask, instances };
// 	} catch {
// 		return { success: false, error: 'Failed to fetch recurring instances' };
// 	}
// }

// Temporary stubs
export async function createRecurringTask(): Promise<ActionResult> {
	return { success: false, error: 'Recurring tasks not yet available' };
}

export async function updateRecurrence(): Promise<ActionResult> {
	return { success: false, error: 'Recurring tasks not yet available' };
}

export async function getRecurringInstances() {
	return { success: false, error: 'Recurring tasks not yet available' };
}
