import * as auth from '$lib/server/auth/session';
import * as guestLinks from '$lib/server/guest/guest-session';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	// First try to validate regular user session
	const sessionToken = event.cookies.get(auth.SESSION_COOKIE_NAME);
	if (sessionToken) {
		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (session) {
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
			event.locals.user = user;
			event.locals.session = session;
			return resolve(event);
		} else {
			auth.deleteSessionTokenCookie(event);
		}
	}

	// If no valid user session, try guest session
	const guestToken = event.cookies.get(guestLinks.GUEST_SESSION_COOKIE_NAME);
	if (guestToken) {
		const { guestSession, guestLink } = await guestLinks.validateGuestSessionToken(guestToken);

		if (guestSession && guestLink) {
			event.locals.guestLink = guestLink;
			event.locals.guestSession = guestSession;
			return resolve(event);
		} else {
			event.cookies.delete(guestLinks.GUEST_SESSION_COOKIE_NAME, { path: '/' });
		}
	}

	// No valid session found
	event.locals.user = null;
	event.locals.session = null;
	event.locals.guestLink = null;
	event.locals.guestSession = null;
	return resolve(event);
};

export const handle: Handle = sequence(handleAuth);
