'use client';

import { useState } from 'react';
import { createTask } from '@/actions/tasks';

function CreateTaskForm() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		await createTask({
			title,
			description: description || null,
		});

		setTitle('');
		setDescription('');
	};

	return (
		<form onSubmit={onSubmit} className="flex gap-2 mb-6">
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Task title"
				className="border p-2 rounded w-full"
				required
			/>

			<input
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
				className="border p-2 rounded w-full"
			/>

			<button type="submit" className="bg-black text-white px-4 py-2 rounded">
				Add
			</button>
		</form>
	);
}

export default CreateTaskForm;
