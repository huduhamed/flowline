import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';

// internal imports
import { prisma } from './prisma';

// Centralize auth options so we can reuse them for getServerSession
export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Email / Password',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) return null;

				const isValid = await compare(credentials.password, user.password);
				if (!isValid) return null;

				return { id: user.id, email: user.email };
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
} as const;

// Initialize NextAuth handler — this returns the route handler function/object
const nextAuthHandler = NextAuth(authOptions as any) as any;

// Export handlers for the API route file to destructure (GET, POST)
export const handlers = nextAuthHandler;

// Provide a stable `auth()` helper that server components and APIs can call to
// get the current session. Use `getServerSession` from next-auth if available.
export async function auth() {
	try {
		const { getServerSession } = await import('next-auth/next');
		const session = await getServerSession(authOptions as any);
		return session;
	} catch (err) {
		// If getServerSession isn't available or fails, return null rather than
		// letting the import crash the server.
		// eslint-disable-next-line no-console
		console.error('getServerSession error:', err);
		return null;
	}
}

// Forward signIn/signOut if provided by the handler; otherwise export placeholders
export const signIn = (nextAuthHandler?.signIn ?? (async () => {
	throw new Error('signIn is not available in this environment');
})) as any;

export const signOut = (nextAuthHandler?.signOut ?? (async () => {
	throw new Error('signOut is not available in this environment');
})) as any;
