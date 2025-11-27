// internal imports
import { auth } from '@/lib/auth';

async function DashboardPage() {
	const session = await auth();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-semibold">Hurrayyyy {session?.user?.email}</h1>
			<p className="text-muted-foreground">Tasks will appear below.</p>
		</div>
	);
}

export default DashboardPage;
