import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';

// internal imports
import { prisma } from './prisma';

// extend the session type to include user
declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			email: string;
		};
	}
}

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
	callbacks: {
		async jwt({ token, user }: { token: any; user?: any }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: any }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
} as const;

const nextAuthHandler = NextAuth(authOptions as any) as any;

export const handlers = nextAuthHandler;

// auth
export async function auth(): Promise<Session | null> {
	try {
		const { getServerSession } = await import('next-auth/next');
		const session = (await getServerSession(authOptions as any)) as Session | null;
		return session;
	} catch (err) {
		console.error('getServerSession error:', err);
		return null;
	}
}

// signIn/signOut
export const signIn = (nextAuthHandler?.signIn ??
	(async () => {
		throw new Error('signIn is not available in this environment');
	})) as any;

export const signOut = (nextAuthHandler?.signOut ??
	(async () => {
		throw new Error('signOut is not available in this environment');
	})) as any;
