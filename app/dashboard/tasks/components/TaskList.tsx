'use client';

import { Task, TaskStatus } from '@prisma/client';
import { useOptimistic, useTransition } from 'react';
import { deleteTask, updateTaskStatus } from '@/actions/tasks';

type OptimisticTask = Task & {
	optimistic?: boolean;
};

type TaskListProps = {
	tasks: Task[];
};

type OptimisticAction =
	| { type: 'delete'; id: string }
	| { type: 'update'; id: string; status: TaskStatus };

function TaskList({ tasks }: TaskListProps) {
	const [isPending, startTransition] = useTransition();

	const [optimisticTasks, applyOptimistic] = useOptimistic<OptimisticTask[], OptimisticAction>(
		tasks,
		(state, action) => {
			switch (action.type) {
				case 'delete':
					return state.filter((task) => task.id !== action.id);

				case 'update':
					return state.map((task) =>
						task.id === action.id ? { ...task, status: action.status, optimistic: true } : task
					);

				default:
					return state;
			}
		}
	);

	function handleDelete(taskId: string) {
		startTransition(() => {
			applyOptimistic({ type: 'delete', id: taskId });
			deleteTask(taskId);
		});
	}

	function handleUpdate(taskId: string, status: TaskStatus) {
		startTransition(() => {
			applyOptimistic({ type: 'update', id: taskId, status });
			updateTaskStatus(taskId, status);
		});
	}

	return (
		<ul className="space-y-3">
			{optimisticTasks.map((task) => (
				<li
					key={task.id}
					className={`border p-3 rounded flex justify-between ${
						task.optimistic ? 'opacity-60' : ''
					}`}
				>
					<div>
						<p className="font-medium">{task.title}</p>

						{task.description && <p className="text-sm text-gray-500">{task.description}</p>}

						<p className="text-xs mt-1 uppercase tracking-wide">{task.status}</p>
					</div>

					<div className="flex gap-2 items-center">
						{task.status !== 'DONE' && (
							<button
								onClick={() => handleUpdate(task.id, 'DONE')}
								disabled={isPending}
								className="text-sm border px-2 py-1 rounded"
							>
								Mark Done
							</button>
						)}

						<button
							onClick={() => handleDelete(task.id)}
							disabled={isPending}
							className="text-sm text-red-500"
						>
							Delete
						</button>
					</div>
				</li>
			))}
		</ul>
	);
}

export default TaskList;
