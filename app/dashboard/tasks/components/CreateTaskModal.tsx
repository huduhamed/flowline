'use client';

import React, { useState, useTransition } from 'react';

// internal imports
import type { ClientTask } from '../types';
import { tempId } from '../utils';
import { useToast } from '@/lib/toast-context';

type Props = {
	open: boolean;
	onClose: () => void;

	onAddOptimistic: (task: ClientTask) => void;
	onReplaceTemp: (tempId: string, serverTask: ClientTask) => void;
	onRollback: (tempId: string) => void;
};

function CreateTaskModal({ open, onClose, onAddOptimistic, onReplaceTemp, onRollback }: Props) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isPending, startTransition] = useTransition();
	const { addToast } = useToast();

	if (!open) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = title.trim();

		// Validation
		if (!trimmed) {
			addToast('Task title is required', 'error');
			return;
		}

		if (trimmed.length > 500) {
			addToast('Task title must be less than 500 characters', 'error');
			return;
		}

		const id = tempId();
		const nowIso = new Date().toISOString();

		const optimistic: ClientTask = {
			id,
			title: trimmed,
			description: description || null,
			status: 'TODO',
			userId: '',
			createdAt: nowIso,
			updatedAt: nowIso,
		};

		// show immediate optimistic entry
		onAddOptimistic(optimistic);
		onClose(); // hide modal quickly

		// send request in background
		startTransition(async () => {
			try {
				const res = await fetch('/api/tasks', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ title: trimmed, description: description || null }),
				});

				if (!res.ok) {
					const error = await res.json().catch(() => null);
					throw new Error(error?.error || 'Failed to create task');
				}

				const serverTask = (await res.json()) as ClientTask;
				onReplaceTemp(id, serverTask);
				addToast('Task created successfully', 'success');
			} catch (err) {
				console.error('Create task failed:', err);
				addToast(err instanceof Error ? err.message : 'Failed to create task', 'error');
				onRollback(id);
			} finally {
				// reset form values
				setTitle('');
				setDescription('');
			}
		});
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-50 flex items-center justify-center"
		>
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />

			<form
				onSubmit={handleSubmit}
				className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg p-6 shadow-lg"
				aria-label="Create task"
			>
				<h2 className="text-lg font-semibold mb-4">New Task</h2>

				<label className="block mb-3">
					<span className="text-sm font-medium">Title</span>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Task title"
						className="mt-1 block w-full border rounded px-3 py-2"
						required
						autoFocus
					/>
				</label>

				<label className="block mb-4">
					<span className="text-sm font-medium">Description (optional)</span>
					<input
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Short description"
						className="mt-1 block w-full border rounded px-3 py-2"
					/>
				</label>

				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 rounded border"
						disabled={isPending}
					>
						Cancel
					</button>

					<button
						type="submit"
						className="px-4 py-2 rounded bg-black text-white"
						disabled={isPending}
					>
						{isPending ? 'Adding…' : 'Add Task'}
					</button>
				</div>
			</form>
		</div>
	);
}

export default CreateTaskModal;
