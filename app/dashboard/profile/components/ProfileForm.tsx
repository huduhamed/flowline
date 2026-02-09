'use client';

import { useState } from 'react';

// internal imports
import { updateUserProfile } from '@/actions/auth';
import { useToast } from '@/lib/toast-context';

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
	const { addToast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// validation
		if (!name.trim()) {
			addToast('Please enter a name', 'error');
			setLoading(false);
			return;
		}

		try {
			const result = await updateUserProfile({ name: name.trim() });
			if (result.success) {
				addToast('Profile updated successfully!', 'success');
			} else {
				addToast(result.error || 'Failed to update profile', 'error');
			}
		} catch {
			addToast('An unexpected error occurred', 'error');
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
