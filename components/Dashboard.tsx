'use client';

import { useMemo, useState } from 'react';

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

// dashboard
export default function Dashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const metrics = useMemo<Metric[]>(
		() => [
			{ id: 'revenue', title: 'Revenue', value: '$24.6k', change: '+8%' },
			{ id: 'orders', title: 'Orders', value: '1.2k', change: '+3%' },
			{ id: 'visitors', title: 'Visitors', value: '9.8k', change: '-1%' },
			{ id: 'conversion', title: 'Conversion', value: '4.6%', change: '+0.2%' },
		],
		[]
	);

	const orders = useMemo<Order[]>(
		() => [
			{
				id: 1,
				order: '#1024',
				customer: 'Alice',
				date: '2025-11-01',
				status: 'Paid',
				total: '$120',
			},
			{
				id: 2,
				order: '#1023',
				customer: 'Bob',
				date: '2025-10-28',
				status: 'Pending',
				total: '$80',
			},
		],
		[]
	);

	return (
		<div className="min-h-screen flex bg-gray-50">
			<Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} />

			<div className="flex-1 flex flex-col">
				<TopNav onToggleSidebar={() => setSidebarOpen((s) => !s)} />

				<main className="p-6 space-y-6 overflow-auto">
					<MetricsGrid metrics={metrics} />

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<RevenueCard />
						<ActivityFeed />
					</div>

					<OrdersTable orders={orders} />
				</main>

				<Footer />
			</div>
		</div>
	);
}

// sidebar
function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
	return (
		<aside
			aria-label="Sidebar"
			className={`transition-all duration-200 bg-white border-r shadow-sm ${
				open ? 'w-64' : 'w-16'
			}`}
		>
			<div className="h-full flex flex-col">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
							F
						</div>
						{open && <span className="font-semibold">Flowline</span>}
					</div>
					<button
						onClick={onToggle}
						className="p-2 rounded hover:bg-gray-100"
						aria-label="Toggle sidebar"
					/>
				</div>

				<nav className="flex-1 px-2 space-y-1">
					{['Overview', 'Analytics', 'Orders', 'Products'].map((item) => (
						<a
							key={item}
							href="#"
							className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
						>
							<span className="w-5 h-5 bg-gray-200 rounded" />
							{open && <span className="text-sm">{item}</span>}
						</a>
					))}
				</nav>

				<div className="p-4 border-t">
					<button className="w-full bg-indigo-600 text-white py-2 rounded text-sm">Create</button>
				</div>
			</div>
		</aside>
	);
}

// top nav
function TopNav({ onToggleSidebar }: { onToggleSidebar: () => void }) {
	return (
		<header className="px-6 py-4 bg-white border-b flex items-center justify-between">
			<button
				className="md:hidden p-2 rounded hover:bg-gray-100"
				onClick={onToggleSidebar}
				aria-label="Open sidebar"
			/>

			<input
				placeholder="Search…"
				className="border rounded-md px-3 py-2 text-sm w-72"
				aria-label="Search"
			/>

			<div className="flex items-center gap-3">
				<div className="w-8 h-8 rounded-full bg-gray-300" />
				<span className="text-sm font-medium">Hud</span>
			</div>
		</header>
	);
}

// metrics grid
function MetricsGrid({ metrics }: { metrics: Metric[] }) {
	return (
		<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{metrics.map((m) => (
				<div key={m.id} className="bg-white border rounded-lg p-4 shadow-sm">
					<p className="text-xs text-gray-500">{m.title}</p>
					<div className="flex items-center justify-between mt-1">
						<p className="text-xl font-semibold">{m.value}</p>
						<span className="text-sm text-green-600">{m.change}</span>
					</div>
				</div>
			))}
		</section>
	);
}

// revenue card
function RevenueCard() {
	return (
		<section className="lg:col-span-2 bg-white border rounded-lg p-4 shadow-sm">
			<h3 className="text-sm font-medium mb-2">Revenue (30 days)</h3>
			<div className="h-48 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
				Chart placeholder
			</div>
		</section>
	);
}

// activity feed
function ActivityFeed() {
	return (
		<aside className="bg-white border rounded-lg p-4 shadow-sm">
			<h3 className="text-sm font-medium mb-3">Recent activity</h3>
			<ul className="space-y-3 text-sm">
				<li>New order #1024</li>
				<li>Payment received</li>
			</ul>
		</aside>
	);
}

// order table
function OrdersTable({ orders }: { orders: Order[] }) {
	return (
		<section className="bg-white border rounded-lg p-4 shadow-sm">
			<h3 className="text-sm font-medium mb-3">Latest orders</h3>
			<table className="w-full text-sm">
				<thead className="text-xs text-gray-500">
					<tr>
						<th className="text-left py-2">Order</th>
						<th className="text-left py-2">Customer</th>
						<th className="text-left py-2">Date</th>
						<th className="text-left py-2">Status</th>
						<th className="text-left py-2">Total</th>
					</tr>
				</thead>
				<tbody className="divide-y">
					{orders.map((o) => (
						<tr key={o.id}>
							<td className="py-2">{o.order}</td>
							<td>{o.customer}</td>
							<td>{o.date}</td>
							<td>{o.status}</td>
							<td>{o.total}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
}

// footer
function Footer() {
	return (
		<footer className="p-4 text-xs text-gray-500 text-center">
			© {new Date().getFullYear()} Flowline
		</footer>
	);
}
