// sidebar
export function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
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
