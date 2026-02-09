'use client';

import { useState } from 'react';

// internal imports
import { changePassword } from '@/actions/auth';
import { useToast } from '@/lib/toast-context';

function ChangePasswordForm() {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { addToast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			addToast('New passwords do not match', 'error');
			return;
		}

		if (newPassword.length < 6) {
			addToast('Password must be at least 6 characters', 'error');
			return;
		}

		setLoading(true);

		try {
			const result = await changePassword({
				currentPassword,
				newPassword,
			});
			if (result.success) {
				addToast('Password changed successfully!', 'success');
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			} else {
				addToast(result.error || 'Failed to change password', 'error');
			}
		} catch {
			addToast('An unexpected error occurred', 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-md">
			<div>
				<label className="block text-sm font-medium mb-2">Current Password</label>
				<input
					type="password"
					value={currentPassword}
					onChange={(e) => setCurrentPassword(e.target.value)}
					required
					className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">New Password</label>
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
					className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">Confirm Password</label>
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
					className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Changing...' : 'Change Password'}
			</button>
		</form>
	);
}

export default ChangePasswordForm;
