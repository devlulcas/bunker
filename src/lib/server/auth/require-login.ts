import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/auth/login');
	}

	return locals.user;
}

export function requireAdmin() {
	const user = requireLogin();
	if (user.role !== 'admin') {
		const route = user.role === 'guest' ? '/dashboard/guest' : '/auth/login';
		return redirect(302, route);
	}
	return user;
}

export function requireGuest() {
	const user = requireLogin();
	if (user.role === 'guest' || user.role === 'admin') {
		return user;
	}
	return redirect(302, '/auth/login');
}
