import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/auth/login');
	}

	return locals.user;
}
