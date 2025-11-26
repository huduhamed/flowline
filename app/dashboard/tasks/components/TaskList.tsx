'use client';

import type { Task, TaskStatus } from '@prisma/client';
import { deleteTask, updateTaskStatus } from '@/actions/tasks';

type Props = {
	tasks: Task[];
};

function TaskList({ tasks }: Props) {
	const statusValues: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

	return (
		<ul className="space-y-3">
			{tasks.map((task) => (
				<li key={task.id} className="border p-3 rounded-md flex justify-between items-center">
					<div>
						<p className="font-medium">{task.title}</p>
						{task.description && <p className="text-sm text-gray-500">{task.description}</p>}
						<p className="text-xs mt-1">{task.status}</p>
					</div>

					<div className="flex gap-2 items-center">
						<select
							value={task.status}
							onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
							className="border rounded px-2 py-1 text-sm"
						>
							{statusValues.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>

						<button
							onClick={() => deleteTask(task.id)}
							className="text-sm text-red-500 hover:underline"
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
