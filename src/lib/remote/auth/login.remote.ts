import { form, getRequestEvent } from '$app/server';
import * as auth from '$lib/server/auth/session';
import { loginUser } from '$lib/server/auth/user-management';
import { fail, redirect } from '@sveltejs/kit';

export const loginAction = form(async (formData) => {
	const username = formData.get('username');
	const password = formData.get('password');

	try {
		const result = await loginUser(username, password);
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, result.id);
		const event = getRequestEvent();
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (error) {
		console.error(error);
		return fail(400, { message: 'Algo deu errado ao fazer login!' });
	}

	return redirect(302, '/dashboard');
});
