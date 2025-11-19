import { auth } from '@/lib/auth';

export default async function DashboardPage() {
	const session = await auth();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-semibold">Welcome, {session?.user?.email}</h1>
			<p className="text-muted-foreground">Tasks will appear below.</p>
		</div>
	);
}
