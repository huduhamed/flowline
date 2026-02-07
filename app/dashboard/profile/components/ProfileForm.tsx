'use client';

import { useState } from 'react';

// internal imports
import { updateUserProfile } from '@/actions/auth';

type ProfileFormProps = {
	user: {
		id: string;
		email: string;
		name: string | null;
	};
};

function ProfileForm({ user }: ProfileFormProps) {
	const [name, setName] = useState(user.name || '');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const result = await updateUserProfile({ name: name.trim() });
			if (result.success) {
				setMessage({ type: 'success', text: 'Profile updated successfully!' });
			} else {
				setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
			}
		} catch {
			setMessage({ type: 'error', text: 'An unexpected error occurred' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium mb-2">Email</label>
				<input
					type="email"
					disabled
					value={user.email}
					className="w-full px-3 py-2 border rounded-md bg-gray-50 cursor-not-allowed"
				/>
				<p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">Full Name</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter your full name"
					className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{message && (
				<div
					className={`p-3 rounded-md text-sm ${
						message.type === 'success'
							? 'bg-green-50 text-green-800 border border-green-200'
							: 'bg-red-50 text-red-800 border border-red-200'
					}`}
				>
					{message.text}
				</div>
			)}

			<button
				type="submit"
				disabled={loading}
				className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Saving...' : 'Save Changes'}
			</button>
		</form>
	);
}

export default ProfileForm;
