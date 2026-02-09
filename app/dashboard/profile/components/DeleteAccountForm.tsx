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
				<p className="text-sm text-gray-600 mb-4">
					Once you delete your account, there is no going back. Please be certain.
				</p>
				<button
					type="button"
					onClick={() => setShowConfirmation(true)}
					className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
				>
					Delete Account
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-md">
			<p className="text-sm text-gray-600">
				Type <strong>DELETE MY ACCOUNT</strong> below to confirm deletion:
			</p>

			<input
				type="text"
				value={confirmText}
				onChange={(e) => setConfirmText(e.target.value)}
				placeholder="DELETE MY ACCOUNT"
				className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
			/>

			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => {
						setShowConfirmation(false);
						setConfirmText('');
					}}
					className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={loading || confirmText !== 'DELETE MY ACCOUNT'}
					className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Deleting...' : 'Delete Account'}
				</button>
			</div>
		</form>
	);
}

export default DeleteAccountForm;
