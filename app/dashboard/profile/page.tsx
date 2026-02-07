import { redirect } from 'next/navigation';

// internal imports
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import DeleteAccountForm from './components/DeleteAccountForm';

async function ProfilePage() {
	const session = await auth();
	if (!session?.user?.id) {
		redirect('/signin');
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { id: true, email: true, name: true, createdAt: true },
	});

	if (!user) {
		redirect('/signin');
	}

	return (
		<div className="p-6 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

			<div className="grid gap-8">
				{/* Edit Profile Section */}
				<section className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Personal Information</h2>
					<ProfileForm user={user} />
				</section>

				{/* Change Password Section */}
				<section className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Change Password</h2>
					<ChangePasswordForm />
				</section>

				{/* Account Info Section */}
				<section className="bg-white rounded-lg border p-6">
					<h2 className="text-xl font-semibold mb-4">Account Information</h2>
					<div className="space-y-3 text-sm">
						<div>
							<span className="text-gray-600">Email:</span>
							<p className="font-medium">{user.email}</p>
						</div>
						<div>
							<span className="text-gray-600">Member Since:</span>
							<p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
						</div>
					</div>
				</section>

				{/* Delete Account Section */}
				<section className="rounded-lg border border-red-200 bg-red-50 p-6">
					<h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
					<DeleteAccountForm />
				</section>
			</div>
		</div>
	);
}

export default ProfilePage;
