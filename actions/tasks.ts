'use server';
import { revalidatePath } from 'next/cache';

// internal imports
import { prisma } from '@/lib/prisma';
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
	formData: FormData,
): Promise<ActionResult> {
	const userId = await requireUser();

	const title = formData.get('title');
	const description = formData.get('description');
	// TODO: Handle priority, dueDate, and tagIds after migration
	// const priority = formData.get('priority') as TaskPriority | null;
	// const dueDate = formData.get('dueDate');
	// const tagIds = formData.getAll('tagIds') as string[];

	if (typeof title !== 'string' || title.trim().length === 0) {
		return { success: false, error: 'Title is required' };
	}

	await prisma.task.create({
		data: {
			title,
			description: typeof description === 'string' ? description : null,
			userId,
			// TODO: Add these after migration
			// priority: priority || 'MEDIUM',
			// dueDate: dueDate && typeof dueDate === 'string' ? new Date(dueDate) : null,
			// tags: tagIds.length > 0 ? { connect: tagIds.map(id => ({ id })) } : undefined,
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

// TODO: Uncomment after Prisma migration
// // update task priority
// export async function updateTaskPriority(
// 	taskId: string,
// 	priority: TaskPriority,
// ): Promise<ActionResult> {
// 	const userId = await requireUser();

// 	await prisma.task.updateMany({
// 		where: {
// 			id: taskId,
// 			userId,
// 		},
// 		data: {
// 			priority,
// 		},
// 	});

// 	revalidatePath('/dashboard/tasks');

// 	return { success: true };
// }

// // update task due date
// export async function updateTaskDueDate(
// 	taskId: string,
// 	dueDate: Date | null,
// ): Promise<ActionResult> {
// 	const userId = await requireUser();

// 	await prisma.task.updateMany({
// 		where: {
// 			id: taskId,
// 			userId,
// 		},
// 		data: {
// 			dueDate,
// 		},
// 	});

// 	revalidatePath('/dashboard/tasks');

// 	return { success: true };
// }

// TODO: Uncomment after Prisma migration - these functions depend on Tag model
// // get or create tags
// export async function getOrCreateTags(
// 	tagNames: string[],
// 	colors: string[] = [],
// ): Promise<{
// 	success: boolean;
// 	error?: string;
// 	tags?: Array<{ id: string; name: string; color: string }>;
// }> {
// 	const userId = await requireUser();

// 	const tags = await Promise.all(
// 		tagNames.map(async (name, index) => {
// 			const existing = await prisma.tag.findFirst({
// 				where: {
// 					name,
// 					userId,
// 				},
// 			});

// 			if (existing) return existing;

// 			return prisma.tag.create({
// 				data: {
// 					name,
// 					color: colors[index] || 'blue',
// 					userId,
// 				},
// 			});
// 		}),
// 	);

// 	return { success: true, tags };
// }

// // get user tags
// export async function getUserTags() {
// 	const userId = await requireUser();

// 	const tags = await prisma.tag.findMany({
// 		where: { userId },
// 		orderBy: { createdAt: 'desc' },
// 	});

// 	return { success: true, tags };
// }

// Temporary stub for getUserTags until migration
export async function getUserTags() {
	return { success: true, tags: [] };
}
