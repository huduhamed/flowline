import type { Task } from '@prisma/client';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// client tasks types
export type ClientTask = Omit<Task, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
	priority?: TaskPriority | null;
	dueDate?: string | null;
};
