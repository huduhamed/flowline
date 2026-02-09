'use client';

export function TaskSkeleton() {
	return (
		<div className="border rounded-lg p-4 animate-pulse">
			<div className="flex justify-between items-start gap-4">
				<div className="flex-1 space-y-2">
					<div className="h-5 bg-gray-200 rounded w-2/3" />
					<div className="h-4 bg-gray-200 rounded w-full" />
					<div className="h-3 bg-gray-200 rounded w-1/4" />
				</div>
				<div className="flex gap-2">
					<div className="h-9 bg-gray-200 rounded w-32" />
					<div className="h-9 bg-gray-200 rounded w-12" />
				</div>
			</div>
		</div>
	);
}

export function TaskListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-3">
			{Array.from({ length: count }).map((_, i) => (
				<TaskSkeleton key={i} />
			))}
		</div>
	);
}
