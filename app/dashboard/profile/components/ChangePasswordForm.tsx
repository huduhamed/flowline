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
		<form onSubmit={handleSubmit} className="space-y-6 max-w-md">
			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
				<input
					type="password"
					value={currentPassword}
					onChange={(e) => setCurrentPassword(e.target.value)}
					required
					placeholder="••••••••"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
				/>
			</div>

			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
					placeholder="••••••••"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
				/>
				<p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
			</div>

			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
					placeholder="••••••••"
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
				/>
			</div>

			<div className="flex gap-3 pt-2">
				<button
					type="submit"
					disabled={loading || !currentPassword || !newPassword || !confirmPassword}
					className="px-6 py-2.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
				>
					{loading ? 'Changing...' : 'Change Password'}
				</button>
				<button
					type="button"
					onClick={() => {
						setCurrentPassword('');
						setNewPassword('');
						setConfirmPassword('');
					}}
					disabled={loading}
					className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}

export default ChangePasswordForm;
