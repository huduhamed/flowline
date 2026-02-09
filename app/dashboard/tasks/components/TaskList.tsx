'use client';

import { useState } from 'react';
import { Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { ClientTask } from '../types';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { TaskStatus } from '@prisma/client';

type Props = {
	tasks: ClientTask[];
	onDeleteLocal?: (id: string) => void;
	onStatusChange?: (id: string, status: TaskStatus) => void;
	onReplaceTemp?: (tempId: string, serverTask: ClientTask) => void;
};

function TaskList({ tasks, onDeleteLocal, onStatusChange }: Props) {
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

	const getStatusIcon = (status: TaskStatus) => {
		switch (status) {
			case 'DONE':
				return <CheckCircle2 className="w-4 h-4 text-green-600" />;
			case 'IN_PROGRESS':
				return <Clock className="w-4 h-4 text-blue-600" />;
			default:
				return <AlertCircle className="w-4 h-4 text-gray-400" />;
		}
	};

	const getStatusColor = (status: TaskStatus) => {
		switch (status) {
			case 'DONE':
				return 'bg-green-50 text-green-700 border-green-200';
			case 'IN_PROGRESS':
				return 'bg-blue-50 text-blue-700 border-blue-200';
			default:
				return 'bg-gray-50 text-gray-700 border-gray-200';
		}
	};

	if (tasks.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">No tasks yet. Create one to get started!</p>
			</div>
		);
	}

	return (
		<>
			<ul className="space-y-3">
				{tasks.map((task) => (
					<li
						key={task.id}
						className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white group"
					>
						<div className="flex justify-between items-start gap-4">
							<div className="flex-1 min-w-0">
								<p className="font-medium text-gray-900 truncate">{task.title}</p>
								{task.description && (
									<p className="text-sm text-gray-600 line-clamp-2 mt-1">{task.description}</p>
								)}
								<div className="flex items-center gap-2 mt-3">
									<span
										className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}
									>
										{getStatusIcon(task.status)}
										{task.status}
									</span>
									<span className="text-xs text-gray-500">
										{new Date(task.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>

							<div className="flex gap-2 items-center flex-shrink-0">
								<select
									value={task.status}
									onChange={(e) => onStatusChange?.(task.id, e.target.value as TaskStatus)}
									className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
								>
									<option value="TODO">To Do</option>
									<option value="IN_PROGRESS">In Progress</option>
									<option value="DONE">Done</option>
								</select>

								<button
									onClick={() => setConfirmDelete(task.id)}
									className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
									title="Delete task"
									aria-label="Delete task"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>

			<ConfirmDialog
				isOpen={!!confirmDelete}
				title="Delete task?"
				message="This action cannot be undone. The task will be permanently deleted."
				confirmText="Delete"
				cancelText="Keep"
				isDangerous
				onConfirm={() => {
					if (confirmDelete) {
						onDeleteLocal?.(confirmDelete);
						setConfirmDelete(null);
					}
				}}
				onCancel={() => setConfirmDelete(null)}
			/>
		</>
	);
}

export default TaskList;
