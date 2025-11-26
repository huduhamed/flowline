import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import CreateTaskForm from './components/CreateTaskForm';
import TaskList from './components/TaskList';

async function TasksPage() {
	const session = await auth();

	if (!session?.user?.id) return null;

	const tasks = await prisma.task.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: 'desc' },
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-6">Tasks</h1>

			<CreateTaskForm />
			<TaskList tasks={tasks} />
		</div>
	);
}

export default TasksPage;
