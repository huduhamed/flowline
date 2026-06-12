import { redirect } from 'next/navigation';

// internal imports
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import DeleteAccountForm from './components/DeleteAccountForm';

export const dynamic = 'force-dynamic';

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
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
				<p className="text-gray-600">Manage your account and preferences</p>
			</div>

			<div className="grid gap-6">
				{/* edit profile section */}
				<section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
							<svg
								className="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
					</div>
					<ProfileForm user={user} />
				</section>

				{/* change password section */}
				<section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
							<svg
								className="w-6 h-6 text-amber-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
					</div>
					<ChangePasswordForm />
				</section>

				{/* account info section */}
				<section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
							<svg
								className="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<span className="text-sm font-medium text-gray-600 block mb-1">Email Address</span>
							<p className="text-gray-900 font-medium">{user.email}</p>
						</div>
						<div>
							<span className="text-sm font-medium text-gray-600 block mb-1">Member Since</span>
							<p className="text-gray-900 font-medium">
								{new Date(user.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</p>
						</div>
					</div>
				</section>

				{/* delete account section */}
				<section className="rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-50 p-6 shadow-sm">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
							<svg
								className="w-6 h-6 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4v2m0 4v2m0-14a9 9 0 110 18 9 9 0 010-18z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
					</div>
					<p className="text-sm text-red-700 mb-4">
						Permanently delete your account and all associated data.
					</p>
					<DeleteAccountForm />
				</section>
			</div>
		</div>
	);
}

export default ProfilePage;
