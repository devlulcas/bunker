import { form, getRequestEvent } from '$app/server';
import * as auth from '$lib/server/auth/session';
import { redirect } from '@sveltejs/kit';

export const logoutAction = form(async () => {
	console.log('logoutAction');
	const event = getRequestEvent();

	if (event.locals.session?.id) {
		await auth.invalidateSession(event.locals.session.id);
	}

	auth.deleteSessionTokenCookie(event);
	redirect(302, '/auth/login');
});
