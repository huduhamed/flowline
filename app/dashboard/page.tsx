import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

// internal imports
import Dashboard from '@/components/Dashboard';
import { authOptions } from '@/lib/auth';

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

// Server data

// mock data
async function getMetrics(): Promise<Metric[]> {
	return [
		{ id: 'revenue', title: 'Revenue', value: '$24.6k', change: '+8%' },
		{ id: 'orders', title: 'Orders', value: '1.2k', change: '+3%' },
		{ id: 'visitors', title: 'Visitors', value: '9.8k', change: '-1%' },
		{ id: 'conversion', title: 'Conversion', value: '4.6%', change: '+0.2%' },
	];
}

// mock data
async function getOrders(): Promise<Order[]> {
	return [
		{ id: 1, order: '#1024', customer: 'Alice', date: '2025-11-01', status: 'Paid', total: '$120' },
		{ id: 2, order: '#1023', customer: 'Bob', date: '2025-10-28', status: 'Pending', total: '$80' },
	];
}

// page
export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/signin');
	}

	// parallel data fetching
	const [metrics, orders] = await Promise.all([getMetrics(), getOrders()]);

	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<Dashboard metrics={metrics} orders={orders} user={session.user} />
		</Suspense>
	);
}

// loading skeleton
function DashboardSkeleton() {
	return (
		<div className="p-6 space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 h-64 rounded-lg bg-gray-100 animate-pulse" />
				<div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
			</div>

			<div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
		</div>
	);
}
