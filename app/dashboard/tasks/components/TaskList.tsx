'use client';

import React, { useTransition } from 'react';
import type { ClientTask } from '../types';
import type { TaskStatus } from '@prisma/client';

type Props = {
	tasks: ClientTask[];
	onDeleteLocal?: (id: string) => void;
	onStatusChange?: (id: string, status: TaskStatus) => void;
	onReplaceTemp?: (tempId: string, serverTask: ClientTask) => void;
};

function TaskList({ tasks, onDeleteLocal, onStatusChange }: Props) {
	const [isPending] = useTransition();

	return (
		<ul className="space-y-3">
			{tasks.map((task) => (
				<li key={task.id} className="border p-3 rounded flex justify-between">
					<div>
						<p className="font-medium">{task.title}</p>
						{task.description && <p className="text-sm text-gray-500">{task.description}</p>}
						<p className="text-xs mt-1 uppercase tracking-wide">{task.status}</p>
					</div>

					<div className="flex gap-2 items-center">
						<select
							value={task.status}
							onChange={(e) => onStatusChange?.(task.id, e.target.value as TaskStatus)}
							className="border rounded px-2 py-1 text-sm disabled:opacity-60"
							disabled={isPending}
						>
							<option value="TODO">TODO</option>
							<option value="IN_PROGRESS">IN_PROGRESS</option>
							<option value="DONE">DONE</option>
						</select>

						<button
							onClick={() => onDeleteLocal?.(task.id)}
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
