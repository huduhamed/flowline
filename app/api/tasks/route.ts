import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// internal imports
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { TaskStatus } from '@prisma/client';

type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

type CreatePayload = {
	title: string;
	description?: string | null;
	priority?: TaskPriority;
	dueDate?: string | null;
	tagIds?: string[];
};

// post
export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = (await req.json()) as CreatePayload;
	if (!body?.title?.trim()) {
		return NextResponse.json({ error: 'Title is required' }, { status: 400 });
	}

	const task = await prisma.task.create({
		data: {
			title: body.title.trim(),
			description: body.description ?? null,
			userId: session.user.id,
			priority: body.priority || 'MEDIUM',
			dueDate: body.dueDate ? new Date(body.dueDate) : null,
			tags: body.tagIds && body.tagIds.length > 0 
				? { connect: body.tagIds.map(id => ({ id })) }
				: undefined,
		},
	});

	return NextResponse.json(task);
}

// delete
export async function DELETE(req: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

	const deleted = await prisma.task.deleteMany({
		where: { id, userId: session.user.id },
	});

	if (deleted.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

	return NextResponse.json({ ok: true });
}

// patch
export async function PATCH(req: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = (await req.json()) as {
		id: string;
		status?: TaskStatus;
		priority?: TaskPriority;
		dueDate?: string | null;
	};
	if (!body?.id) {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
	}

	const updateData: Record<string, unknown> = {};
	if (body.status) updateData.status = body.status;
	if (body.priority) updateData.priority = body.priority;
	if ('dueDate' in body) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;

	const updated = await prisma.task.updateMany({
		where: { id: body.id, userId: session.user.id },
		data: updateData,
	});

	if (updated.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

	return NextResponse.json({ ok: true });
}
