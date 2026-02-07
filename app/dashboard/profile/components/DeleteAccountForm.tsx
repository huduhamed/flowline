'use client';

import { useState } from 'react';

// internal imports
import { deleteAccount } from '@/actions/auth';

function DeleteAccountForm() {
	const [confirmText, setConfirmText] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);

		if (confirmText !== 'DELETE MY ACCOUNT') {
			setMessage({ type: 'error', text: 'You must type "DELETE MY ACCOUNT" to confirm' });
			return;
		}

		setLoading(true);

		try {
			const result = await deleteAccount();
			if (result.success) {
				setMessage({ type: 'success', text: 'Account deleted. Redirecting...' });
			} else {
				setMessage({ type: 'error', text: result.error || 'Failed to delete account' });
			}
		} catch {
			setMessage({ type: 'error', text: 'An unexpected error occurred' });
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

			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => {
						setShowConfirmation(false);
						setConfirmText('');
						setMessage(null);
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
