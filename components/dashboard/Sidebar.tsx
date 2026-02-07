import Link from 'next/link';

// sidebar
export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
	const navItems = [
		{ label: 'Dashboard', href: '/dashboard' },
		{ label: 'Tasks', href: '/dashboard/tasks' },
		{ label: 'Profile', href: '/dashboard/profile' },
	];

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
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-sm"
						>
							{open && <span>{item.label}</span>}
							{!open && <span title={item.label}>•</span>}
						</Link>
					))}
				</nav>

				<div className="p-4 border-t">
					{open && (
						<p className="text-xs text-gray-500 mb-2">Quick actions</p>
					)}
				</div>
			</div>
		</aside>
	);
}
