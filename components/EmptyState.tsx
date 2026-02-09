'use client';

export function EmptyState({
	title = 'No tasks yet',
	description = 'Create your first task to get started',
	icon = '📝',
	action,
}: {
	title?: string;
	description?: string;
	icon?: string;
	action?: { label: string; onClick: () => void };
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="text-6xl mb-4">{icon}</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-sm text-gray-600 mb-6 max-w-md">{description}</p>
			{action && (
				<button
					onClick={action.onClick}
					className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
				>
					{action.label}
				</button>
			)}
		</div>
	);
}
