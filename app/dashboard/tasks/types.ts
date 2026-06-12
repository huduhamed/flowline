import type { Task } from '@prisma/client';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// client tasks types
export type ClientTask = Omit<Task, 'createdAt' | 'updatedAt' | 'dueDate' | 'recurrenceEndDate'> & {
	createdAt: string;
	updatedAt: string;
	dueDate: string | null;
	recurrenceEndDate: string | null;
};
