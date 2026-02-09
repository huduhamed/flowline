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

		// validation
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
		onClose();

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
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
		>
			{/* backdrop */}
			<div
				className="absolute inset-0 bg-black/50 transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* modal */}
			<form
				onSubmit={handleSubmit}
				className="relative z-10 w-full max-w-lg bg-white rounded-lg p-6 shadow-xl animate-in scale-95 fade-in duration-200"
				aria-label="Create task"
			>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Close"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="space-y-4 mb-6">
					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">Task Title *</label>
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="What needs to be done?"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							required
							autoFocus
							maxLength={500}
						/>
						<p className="mt-1 text-xs text-gray-500">{title.length}/500</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">
							Description (optional)
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add more details about this task..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
							rows={3}
							maxLength={1000}
						/>
						<p className="mt-1 text-xs text-gray-500">{description.length}/1000</p>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={isPending}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Cancel
					</button>

					<button
						type="submit"
						className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						disabled={isPending}
					>
						{isPending ? 'Creating…' : 'Create Task'}
					</button>
				</div>
			</form>
		</div>
	);
}

export default CreateTaskModal;
