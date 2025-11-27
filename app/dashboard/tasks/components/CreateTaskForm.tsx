'use client';

import React, { useState, useTransition } from 'react';
import type { Task } from '@prisma/client';
import { tempId } from '../utils';

type CreateTaskInput = {
	title: string;
	description?: string | null;
};

type Props = {
	onAddOptimistic: (task: Task) => void;
	onReplaceTemp?: (tempId: string, serverTask: Task) => void;
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

		const tempTask: Task = {
			id: tempId(),
			title: trimmed,
			description: description || null,
			status: 'TODO',
			userId: '',
			createdAt: new Date().toISOString() as unknown as Date,
			updatedAt: new Date().toISOString() as unknown as Date,
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

				const serverTask = (await res.json()) as Task;
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
