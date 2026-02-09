'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// internal imports
import type { ClientTask } from './types';
import TaskList from './components/TaskList';
import CreateTaskModal from './components/CreateTaskModal';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import type { TaskStatus } from '@prisma/client';
import { useToast } from '@/lib/toast-context';

type Props = {
	initialTasks: ClientTask[];
	initialFilters?: { status?: string; q?: string };
};

export default function TasksClient({ initialTasks, initialFilters }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { addToast } = useToast();

	// initialize filters
	const initialQ = initialFilters?.q ?? searchParams?.get('q') ?? '';
	const initialStatus = initialFilters?.status ?? searchParams?.get('status') ?? 'ALL';

	const [tasks, setTasks] = useState<ClientTask[]>(initialTasks);
	const [modalOpen, setModalOpen] = useState(false);

	// filters
	const [query, setQuery] = useState<string>(initialQ);
	const [statusFilter, setStatusFilter] = useState<string>(initialStatus);

	const debouncedQuery = useDebouncedValue(query, 300);

	// keep URL in sync
	useEffect(() => {
		const params = new URLSearchParams();
		if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter);
		if (debouncedQuery) params.set('q', debouncedQuery);

		const pathname = typeof window !== 'undefined' ? window.location.pathname : '/dashboard/tasks';

		router.replace(`${pathname}?${params.toString()}`);
	}, [statusFilter, debouncedQuery, router]);

	const addOptimistic = (task: ClientTask) => setTasks((prev) => [task, ...prev]);
	const replaceTemp = (tempIdStr: string, serverTask: ClientTask) =>
		setTasks((prev) => prev.map((t) => (t.id === tempIdStr ? serverTask : t)));
	const rollback = (tempIdStr: string) =>
		setTasks((prev) => prev.filter((t) => t.id !== tempIdStr));

	const visibleTasks = useMemo(() => {
		const q = (debouncedQuery ?? '').trim().toLowerCase();
		return tasks.filter((t) => {
			if (statusFilter && statusFilter !== 'ALL' && t.status !== statusFilter) return false;
			if (!q) return true;
			const inTitle = t.title.toLowerCase().includes(q);
			const inDesc = (t.description ?? '').toLowerCase().includes(q);
			return inTitle || inDesc;
		});
	}, [tasks, statusFilter, debouncedQuery]);

	const handleDeleteLocal = (id: string) => {
		const previous = tasks;
		setTasks((s) => s.filter((t) => t.id !== id));

		// fire server delete in background with optimistic rollback
		(async () => {
			try {
				const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
				if (!res.ok) {
					const error = await res.json().catch(() => null);
					throw new Error(error?.error || 'Failed to delete task');
				}
				addToast('Task deleted successfully', 'success');
			} catch (err) {
				console.error(err);
				addToast(err instanceof Error ? err.message : 'Failed to delete task', 'error');
				setTasks(previous);
			}
		})();
	};

	const handleStatusChange = (id: string, status: TaskStatus) => {
		const previous = tasks;
		setTasks((s) => s.map((t) => (t.id === id ? { ...t, status } : t)));

		(async () => {
			try {
				const res = await fetch('/api/tasks', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id, status }),
				});
				if (!res.ok) {
					const error = await res.json().catch(() => null);
					throw new Error(error?.error || 'Failed to update task');
				}
				addToast('Task status updated', 'success');
			} catch (err) {
				console.error(err);
				addToast(err instanceof Error ? err.message : 'Failed to update task', 'error');
				setTasks(previous);
			}
		})();
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4 gap-4">
				<div className="flex gap-2 items-center">
					<div className="flex rounded-md overflow-hidden border">
						{(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
							<button
								key={s}
								onClick={() => setStatusFilter(s)}
								className={`px-3 py-1 text-sm ${
									statusFilter === s ? 'bg-black text-white' : 'bg-white'
								}`}
							>
								{s === 'ALL' ? 'All' : s.replace('_', ' ')}
							</button>
						))}
					</div>

					<input
						placeholder="Search tasks..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="border rounded px-3 py-2 ml-3"
					/>
				</div>

				<button
					onClick={() => setModalOpen(true)}
					className="px-3 py-1 rounded bg-black text-white"
				>
					New Task
				</button>
			</div>

			<CreateTaskModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAddOptimistic={addOptimistic}
				onReplaceTemp={replaceTemp}
				onRollback={rollback}
			/>

			<TaskList
				tasks={visibleTasks}
				onDeleteLocal={handleDeleteLocal}
				onStatusChange={handleStatusChange}
			/>
		</div>
	);
}
