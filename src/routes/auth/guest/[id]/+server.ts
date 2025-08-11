import { getGuestLink } from '$lib/server/guest/guest-management.js';
import { GUEST_SESSION_COOKIE_NAME, createGuestSession } from '$lib/server/guest/guest-session.js';
import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ params, cookies }) => {
	if (!params.id) {
		return error(400, {
			message: 'Seu link de acesso é inválido'
		});
	}

	const guestLink = await getGuestLink(params.id);
	if (!guestLink) {
		return error(400, {
			message: 'Seu link de acesso é inválido'
		});
	}

	const expiresAt = new Date(
		guestLink.createdAt.getTime() + guestLink.durationHours * 60 * 60 * 1000
	);

	if (Date.now() >= expiresAt.getTime()) {
		return error(400, {
			message: 'Seu link de acesso expirou'
		});
	}

	try {
		const { guestSession } = await createGuestSession(params.id);

		// Set the guest session cookie
		cookies.set(GUEST_SESSION_COOKIE_NAME, guestSession.token, {
			expires: guestSession.expiresAt,
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		return redirect(302, '/dashboard/guest');
	} catch (err) {
		console.error('Failed to create guest session:', err);
		return error(500, {
			message: 'Erro ao acessar o link de acesso'
		});
	}
};
