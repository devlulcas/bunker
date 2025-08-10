import * as auth from '$lib/server/auth';
import { loginUser } from '$lib/server/auth/user-management';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		const route = event.locals.user.role === 'admin' ? '/dashboard' : '/guest';
		return redirect(302, route);
	}

	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const result = await loginUser(username, password);

		if (!result.success) {
			return fail(400, { message: result.error });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, result.user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		const route = result.user.role === 'admin' ? '/dashboard' : '/guest';
		return redirect(302, route);
	}
};
