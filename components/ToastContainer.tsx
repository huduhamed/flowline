'use client';

import { useToast } from '@/lib/toast-context';
import { X } from 'lucide-react';

export function ToastContainer() {
	const { toasts, removeToast } = useToast();

	return (
		<div className="fixed bottom-0 right-0 z-50 p-4 pointer-events-none">
			<div className="space-y-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`
							rounded-lg shadow-lg p-4 pointer-events-auto
							flex items-center justify-between gap-4
							min-w-80 max-w-md
							animate-in slide-in-from-bottom-4 fade-in
							${
								toast.type === 'success'
									? 'bg-green-50 text-green-800 border border-green-200'
									: toast.type === 'error'
										? 'bg-red-50 text-red-800 border border-red-200'
										: toast.type === 'warning'
											? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
											: 'bg-blue-50 text-blue-800 border border-blue-200'
							}
						`}
					>
						<p className="text-sm font-medium">{toast.message}</p>
						<button
							onClick={() => removeToast(toast.id)}
							className="flex-shrink-0 text-current opacity-70 hover:opacity-100"
							aria-label="Close toast"
						>
							<X size={16} />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
