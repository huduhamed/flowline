'use client';

import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	isDangerous?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function ConfirmDialog({
	isOpen,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	isDangerous = false,
	onConfirm,
	onCancel,
	isLoading = false,
}: ConfirmDialogProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || !isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* backdrop */}
			<div
				className="absolute inset-0 bg-black/50 transition-opacity"
				onClick={onCancel}
				aria-hidden="true"
			/>

			{/* dialog */}
			<div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full animate-in scale-95 fade-in duration-200">
				<div className="p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
					<p className="text-sm text-gray-600 mb-6">{message}</p>

					<div className="flex gap-3 justify-end">
						<button
							onClick={onCancel}
							disabled={isLoading}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{cancelText}
						</button>
						<button
							onClick={onConfirm}
							disabled={isLoading}
							className={`px-4 py-2 text-sm font-medium rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
								isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
							}`}
						>
							{isLoading ? 'Processing...' : confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
