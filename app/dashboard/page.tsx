import { Suspense } from 'react';

// internal imports
import Dashboard from '@/components/Dashboard';

// types
type Metric = {
	id: string;
	title: string;
	value: string;
	change: string;
};

type Order = {
	id: number;
	order: string;
	customer: string;
	date: string;
	status: string;
	total: string;
};

// Server data fetching
async function getMetrics(): Promise<Metric[]> {
	return [
		{ id: 'revenue', title: 'Revenue', value: '$24.6k', change: '+8%' },
		{ id: 'orders', title: 'Orders', value: '1.2k', change: '+3%' },
		{ id: 'visitors', title: 'Visitors', value: '9.8k', change: '-1%' },
		{ id: 'conversion', title: 'Conversion', value: '4.6%', change: '+0.2%' },
	];
}

async function getOrders(): Promise<Order[]> {
	return [
		{ id: 1, order: '#1024', customer: 'Alice', date: '2025-11-01', status: 'Paid', total: '$120' },
		{ id: 2, order: '#1023', customer: 'Bob', date: '2025-10-28', status: 'Pending', total: '$80' },
	];
}

// Page
export default async function DashboardPage() {
	const [metrics, orders] = await Promise.all([getMetrics(), getOrders()]);

	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<Dashboard metrics={metrics} orders={orders} />
		</Suspense>
	);
}

// Loading skeleton
function DashboardSkeleton() {
	return (
		<div className="p-6 space-y-4">
			<div className="grid grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
				))}
			</div>
			<div className="h-64 bg-gray-100 rounded animate-pulse" />
		</div>
	);
}
