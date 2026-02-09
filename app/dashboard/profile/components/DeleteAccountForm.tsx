'use client';

import { useState } from 'react';

// internal imports
import { deleteAccount } from '@/actions/auth';
import { useToast } from '@/lib/toast-context';

function DeleteAccountForm() {
	const [confirmText, setConfirmText] = useState('');
	const [loading, setLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const { addToast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (confirmText !== 'DELETE MY ACCOUNT') {
			addToast('You must type "DELETE MY ACCOUNT" to confirm', 'error');
			return;
		}

		setLoading(true);

		try {
			const result = await deleteAccount();
			if (result.success) {
				addToast('Account deleted successfully!', 'success');
			} else {
				addToast(result.error || 'Failed to delete account', 'error');
			}
		} catch {
			addToast('An unexpected error occurred', 'error');
		} finally {
			setLoading(false);
		}
	};

	if (!showConfirmation) {
		return (
			<div>
				<p className="text-sm text-red-700 mb-4">
					Once you delete your account, there is no going back. Please be certain.
				</p>
				<button
					type="button"
					onClick={() => setShowConfirmation(true)}
					className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
				>
					Delete My Account
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6 max-w-md">
			<div className="bg-red-100 border border-red-300 rounded-lg p-4">
				<p className="text-sm text-red-900">
					Type <strong className="font-semibold">DELETE MY ACCOUNT</strong> in the field below to
					confirm. This action cannot be undone.
				</p>
			</div>

			<input
				type="text"
				value={confirmText}
				onChange={(e) => setConfirmText(e.target.value)}
				placeholder="DELETE MY ACCOUNT"
				maxLength={20}
				className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 font-mono"
			/>

			<div className="flex gap-3">
				<button
					type="button"
					onClick={() => {
						setShowConfirmation(false);
						setConfirmText('');
					}}
					disabled={loading}
					className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={loading || confirmText !== 'DELETE MY ACCOUNT'}
					className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
				>
					{loading ? 'Deleting...' : 'Delete Account'}
				</button>
			</div>
		</form>
	);
}

export default DeleteAccountForm;
