'use client';

import React, { useState, useTransition, useEffect } from 'react';

// internal imports
import type { ClientTask, TaskPriority } from '../types';
import { tempId } from '../utils';
import { useToast } from '@/lib/toast-context';
import { getUserTags } from '@/actions/tasks';

type Tag = {
	id: string;
	name: string;
	color: string;
};

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
	const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
	const [dueDate, setDueDate] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [availableTags, setAvailableTags] = useState<Tag[]>([]);
	const [isPending, startTransition] = useTransition();
	const { addToast } = useToast();

	useEffect(() => {
		if (open) {
			// Load available tags
			getUserTags().then((result) => {
				if (result.success && result.tags) {
					setAvailableTags(result.tags);
				}
			});
		}
	}, [open]);

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
			priority,
			dueDate: dueDate ? new Date(dueDate).toISOString() : null,
			recurrence: null,
			recurrenceEndDate: null,
			parentTaskId: null,
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
					body: JSON.stringify({
						title: trimmed,
						description: description || null,
						priority,
						dueDate: dueDate ? new Date(dueDate).toISOString() : null,
						tagIds: selectedTags,
					}),
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
				setPriority('MEDIUM');
				setDueDate('');
				setSelectedTags([]);
			}
		});
	};

	const getPriorityColor = (prio: string) => {
		switch (prio) {
			case 'LOW':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'MEDIUM':
				return 'text-blue-600 bg-blue-50 border-blue-200';
			case 'HIGH':
				return 'text-amber-600 bg-amber-50 border-amber-200';
			case 'URGENT':
				return 'text-red-600 bg-red-50 border-red-200';
			default:
				return '';
		}
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
				className="relative z-10 w-full max-w-lg bg-white rounded-lg p-6 shadow-xl animate-in scale-95 fade-in duration-200 max-h-[90vh] overflow-y-auto"
				aria-label="Create task"
			>
				<div className="flex items-center justify-between mb-6 sticky top-0 bg-white">
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

				<div className="space-y-5 mb-6">
					<div>
						<label className="block text-sm font-semibold text-gray-900 mb-2">Task Title *</label>
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
						<label className="block text-sm font-semibold text-gray-900 mb-2">
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

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-semibold text-gray-900 mb-2">Priority</label>
							<select
								value={priority}
								onChange={(e) =>
									setPriority(e.target.value as TaskPriority)
								}
								className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium transition-all ${getPriorityColor(priority)} border`}
							>
								<option value="LOW">Low</option>
								<option value="MEDIUM">Medium</option>
								<option value="HIGH">High</option>
								<option value="URGENT">Urgent</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-900 mb-2">
								Due Date (optional)
							</label>
							<input
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
								min={new Date().toISOString().split('T')[0]}
							/>
						</div>
					</div>

					{availableTags.length > 0 && (
						<div>
							<label className="block text-sm font-semibold text-gray-900 mb-3">
								Tags (optional)
							</label>
							<div className="flex flex-wrap gap-2">
								{availableTags.map((tag) => (
									<button
										key={tag.id}
										type="button"
										onClick={() => {
											setSelectedTags((prev) =>
												prev.includes(tag.id)
													? prev.filter((id) => id !== tag.id)
													: [...prev, tag.id],
											);
										}}
										className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
											selectedTags.includes(tag.id)
												? `bg-${tag.color}-600 text-white border border-${tag.color}-700`
												: `bg-${tag.color}-100 text-${tag.color}-700 border border-${tag.color}-200 hover:bg-${tag.color}-200`
										}`}
									>
										{tag.name}
									</button>
								))}
							</div>
							<p className="mt-2 text-xs text-gray-500">
								Selected: {selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'}
							</p>
						</div>
					)}
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
