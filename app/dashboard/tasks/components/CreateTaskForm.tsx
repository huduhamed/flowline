'use client';

import React, { useState, useTransition } from 'react';
import type { ClientTask } from '../types';
import { tempId } from '../utils';

type CreateTaskInput = {
	title: string;
	description?: string | null;
};

type Props = {
	onAddOptimistic: (task: ClientTask) => void;
	onReplaceTemp?: (tempId: string, serverTask: ClientTask) => void;
	onRollback?: (tempId: string) => void;
};

export default function CreateTaskForm({ onAddOptimistic, onReplaceTemp, onRollback }: Props) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = title.trim();
		if (!trimmed) return;

		const nowIso = new Date().toISOString();

		const tempTask: ClientTask = {
			id: tempId(),
			title: trimmed,
			description: description || null,
			status: 'TODO',
			priority: 'MEDIUM',
			dueDate: null,
			recurrence: null,
			recurrenceEndDate: null,
			parentTaskId: null,
			userId: '',
			createdAt: nowIso,
			updatedAt: nowIso,
		};

		// show task
		onAddOptimistic(tempTask);

		// non blocking UI
		startTransition(async () => {
			try {
				const res = await fetch('/api/tasks', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ title: trimmed, description: description || null }),
				});

				if (!res.ok) {
					throw new Error('Failed to create');
				}

				const serverTask = (await res.json()) as ClientTask;
				onReplaceTemp?.(tempTask.id, serverTask);
			} catch (err) {
				onRollback?.(tempTask.id);
				console.error(err);
			}
		});

		setTitle('');
		setDescription('');
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 mb-6">
			<input
				className="border p-2 rounded w-full"
				placeholder="Task title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				required
			/>
			<input
				className="border p-2 rounded w-full"
				placeholder="Description (optional)"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<button
				type="submit"
				className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
				disabled={isPending}
			>
				{isPending ? 'Adding…' : 'Add'}
			</button>
		</form>
	);
}
