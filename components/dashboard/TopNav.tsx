'use client';

import { signOut } from 'next-auth/react';

// props for the Dashboard
type User = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

type TopNavProps = {
	onToggleSidebar: () => void;
	user: User;
};

export default function TopNav({ onToggleSidebar, user }: TopNavProps) {
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
				{user.image ? (
					<img src={user.image} alt={user.name ?? 'User avatar'} className="w-8 h-8 rounded-full" />
				) : (
					<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
						{user.name?.charAt(0) ?? 'U'}
					</div>
				)}
				<span className="text-sm font-medium">{user.name ?? user.email}</span>
				<button
					onClick={() => signOut({ callbackUrl: '/login' })}
					className="ml-2 text-xs text-red-500 hover:underline"
				>
					Sign out
				</button>
			</div>
		</header>
	);
}
