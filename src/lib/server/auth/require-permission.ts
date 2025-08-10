import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import type { GuestLink } from '../db/schema';

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

export function requireGuest(): GuestLink {
	const { locals } = getRequestEvent();

	if (locals.user?.role === 'admin') {
		return {
			id: locals.user.id,
			username: locals.user.username,
			allowedPages: JSON.stringify(['*']),
			durationHours: 1000,
			createdAt: new Date(),
			createdBy: locals.user.id
		};
	}

	if (locals.guestLink) {
		return locals.guestLink;
	}

	return redirect(302, '/auth/login');
}
