'use client';

import { useState } from 'react';

// internal imports
import { changePassword } from '@/actions/auth';

function ChangePasswordForm() {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);

		if (newPassword !== confirmPassword) {
			setMessage({ type: 'error', text: 'New passwords do not match' });
			return;
		}

		if (newPassword.length < 6) {
			setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
			return;
		}

		setLoading(true);

		try {
			const result = await changePassword({
				currentPassword,
				newPassword,
			});
			if (result.success) {
				setMessage({ type: 'success', text: 'Password changed successfully!' });
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			} else {
				setMessage({ type: 'error', text: result.error || 'Failed to change password' });
			}
		} catch {
			setMessage({ type: 'error', text: 'An unexpected error occurred' });
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
				{loading ? 'Changing...' : 'Change Password'}
			</button>
		</form>
	);
}

export default ChangePasswordForm;
