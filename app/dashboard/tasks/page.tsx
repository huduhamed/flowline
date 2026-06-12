// internal imports
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import TasksClient from './client';
import type { ClientTask } from './types';

export const dynamic = 'force-dynamic';

type SearchParams = {
	status?: string;
	q?: string;
	sortBy?: 'created' | 'dueDate' | 'priority' | 'status';
	sortOrder?: 'asc' | 'desc';
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
	const session = await auth();
	if (!session?.user?.id) return null;

	// server-side filtering
	const where: any = { userId: session.user.id };
	if (searchParams.status && ['TODO', 'IN_PROGRESS', 'DONE'].includes(searchParams.status)) {
		where.status = searchParams.status;
	}
	if (searchParams.q) {
		where.OR = [
			{ title: { contains: searchParams.q, mode: 'insensitive' } },
			{ description: { contains: searchParams.q, mode: 'insensitive' } },
		];
	}

	// server-side sorting
	const orderBy: any = {};
	const sortBy = searchParams.sortBy || 'created';
	const sortOrder = searchParams.sortOrder || 'desc';

	switch (sortBy) {
		case 'dueDate':
			orderBy.dueDate = sortOrder;
			break;
		case 'priority':
			orderBy.priority = sortOrder;
			break;
		case 'status':
			orderBy.status = sortOrder;
			break;
		default:
			orderBy.createdAt = sortOrder;
	}

	const tasks = await prisma.task.findMany({
		where,
		orderBy,
	});

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
				<p className="text-gray-600">Organize and track your work</p>
			</div>
			<TasksClient
				initialTasks={tasks as unknown as ClientTask[]}
				defaultSortBy={sortBy}
				defaultSortOrder={sortOrder}
			/>
		</div>
	);
}
