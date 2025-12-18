'use client';

import { useMemo, useState } from 'react';

// Dashboard.tsx
function Dashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [query, setQuery] = useState('');

	// Dummy metrics
	const metrics = useMemo(
		() => [
			{ id: 'revenue', title: 'Revenue', value: '$24.6k', change: '+8%' },
			{ id: 'orders', title: 'Orders', value: '1.2k', change: '+3%' },
			{ id: 'visitors', title: 'Visitors', value: '9.8k', change: '-1%' },
			{ id: 'conversion', title: 'Conversion', value: '4.6%', change: '+0.2%' },
		],
		[]
	);

	return (
		<div className="min-h-screen flex bg-gray-50">
			{/* Sidebar */}
			<aside
				aria-label="Sidebar"
				className={`flex-shrink-0 transition-all duration-200 ease-in-out shadow-sm bg-white border-r border-gray-200 ${
					sidebarOpen ? 'w-64' : 'w-16'
				}`}
			>
				<div className="h-full flex flex-col">
					<div className="flex items-center justify-between p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-indigo-600 w-8 h-8 flex items-center justify-center text-white font-bold">
								F
							</div>
							{sidebarOpen && <span className="font-semibold">FlowDash</span>}
						</div>
						<button
							aria-pressed={!sidebarOpen}
							aria-label={sidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
							onClick={() => setSidebarOpen((s) => !s)}
							className="p-2 rounded hover:bg-gray-100"
						>
							{/* simple chevron */}
							<svg
								className={`w-4 h-4 transform ${sidebarOpen ? '' : 'rotate-180'}`}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 18l6-6-6-6"
								/>
							</svg>
						</button>
					</div>

					<nav className="flex-1 px-2 py-4 space-y-1" aria-label="Main navigation">
						{[
							{ label: 'Overview', icon: 'M3 12h18' },
							{ label: 'Analytics', icon: 'M12 6v12' },
							{ label: 'Orders', icon: 'M3 6h18v12H3z' },
							{ label: 'Products', icon: 'M12 3v18' },
						].map((item) => (
							<a
								key={item.label}
								href="#"
								className="group flex items-center gap-3 p-2 rounded hover:bg-gray-100"
								role="menuitem"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
								{sidebarOpen && <span className="text-sm">{item.label}</span>}
							</a>
						))}
					</nav>

					<div className="p-4 border-t border-gray-100">
						<button className="w-full text-sm bg-indigo-600 text-white py-2 rounded">Create</button>
					</div>
				</div>
			</aside>

			{/* Main content area */}
			<div className="flex-1 flex flex-col">
				<header className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							className="md:hidden p-2 rounded hover:bg-gray-100"
							onClick={() => setSidebarOpen((s) => !s)}
							aria-label="Toggle sidebar"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>

						<div className="relative">
							<label htmlFor="search" className="sr-only">
								Search
							</label>
							<input
								id="search"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search ..."
								className="pl-3 pr-10 py-2 border rounded-md text-sm w-72"
								aria-label="Search"
							/>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<button className="p-2 rounded hover:bg-gray-100" aria-label="Notifications">
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
								/>
							</svg>
						</button>
						<div className="flex items-center gap-2">
							<img
								src="https://i.pravatar.cc/150?u=fake@pravatar.com"
								alt="User avatar"
								className="w-8 h-8 rounded-full object-cover"
							/>
							<span className="text-sm font-medium">Fodio</span>
						</div>
					</div>
				</header>

				<main className="p-6 overflow-auto">
					{/* Top metrics */}
					<section aria-labelledby="top-stats">
						<h2 id="top-stats" className="sr-only">
							Top statistics
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{metrics.map((m) => (
								<div key={m.id} className="bg-white p-4 rounded-lg shadow-sm border">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-xs text-gray-500">{m.title}</p>
											<p className="text-xl font-semibold">{m.value}</p>
										</div>
										<div className="text-sm text-green-600">{m.change}</div>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* Charts + Table */}
					<section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
						<article className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border">
							<h3 className="text-sm font-medium mb-2">Revenue (30 days)</h3>

							{/* Placeholder chart: prefer to swap with a real chart lib in client layer (recharts / chart.js / apex). */}
							<div
								role="img"
								aria-label="Revenue chart"
								className="h-48 w-full bg-gradient-to-r from-white to-gray-50 rounded-md flex items-center justify-center text-gray-400"
							>
								Chart placeholder — history
							</div>
						</article>

						<aside className="bg-white p-4 rounded-lg shadow-sm border">
							<h3 className="text-sm font-medium mb-2">Recent activity</h3>
							<ul className="space-y-3 text-sm">
								<li className="flex items-start gap-3">
									<div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1" />
									<div>
										<div className="font-medium">New order</div>
										<div className="text-gray-500 text-xs">Order #1024 — $120</div>
									</div>
								</li>
								<li className="flex items-start gap-3">
									<div className="w-2.5 h-2.5 rounded-full bg-green-400 mt-1" />
									<div>
										<div className="font-medium">Payment received</div>
										<div className="text-gray-500 text-xs">Invoice #321</div>
									</div>
								</li>
							</ul>
						</aside>
					</section>

					{/* Table */}
					<section className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
						<h3 className="text-sm font-medium mb-3">Latest orders</h3>
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left text-xs text-gray-500 uppercase">
										<th className="py-2 pr-4">Order</th>
										<th className="py-2 pr-4">Customer</th>
										<th className="py-2 pr-4">Date</th>
										<th className="py-2 pr-4">Status</th>
										<th className="py-2">Total</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{[
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
									].map((r) => (
										<tr key={r.id}>
											<td className="py-3 pr-4">{r.order}</td>
											<td className="py-3 pr-4">{r.customer}</td>
											<td className="py-3 pr-4">{r.date}</td>
											<td className="py-3 pr-4">{r.status}</td>
											<td className="py-3">{r.total}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>
				</main>

				<footer className="p-4 text-xs text-gray-500 text-center">
					© {new Date().getFullYear()} FlowDash
				</footer>
			</div>
		</div>
	);
}

export default Dashboard;
