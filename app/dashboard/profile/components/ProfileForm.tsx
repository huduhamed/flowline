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
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
				<input
					type="email"
					disabled
					value={user.email}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
				/>
				<p className="text-xs text-gray-500 mt-2">Email address cannot be changed</p>
			</div>

			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter your full name"
					maxLength={100}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
				/>
				<p className="text-xs text-gray-500 mt-2">{name.length}/100 characters</p>
			</div>

			<div className="flex gap-3 pt-2">
				<button
					type="submit"
					disabled={loading || !name.trim()}
					className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
				>
					{loading ? 'Saving...' : 'Save Changes'}
				</button>
				<button
					type="button"
					onClick={() => setName(user.name || '')}
					disabled={loading}
					className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}

export default ProfileForm;
