'use server';

import { z } from 'zod';

const Schema = z.object({
	email: z.string().email(),
});

export async function handleSubmit(input: FormData) {
	const parsed = Schema.safeParse({
		email: input.get('email'),
	});

	if (!parsed.success) {
		return { ok: false, errors: parsed.error.flatten() };
	}

	return { ok: true, data: parsed.data };
}
