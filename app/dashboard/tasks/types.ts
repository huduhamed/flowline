import type { Task } from '@prisma/client';

// client tasks types
export type ClientTask = Omit<Task, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};
