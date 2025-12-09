import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import TasksClient from './client';
import type { ClientTask } from './types';

type SearchParams = {
	status?: string;
	q?: string;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
	const session = await auth();
	if (!session?.user?.id) return null;

	// Server-side filtering
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

	const tasks = await prisma.task.findMany({
		where,
		orderBy: { createdAt: 'desc' },
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-6">Tasks</h1>
			<TasksClient initialTasks={tasks as unknown as ClientTask[]} />
		</div>
	);
}
