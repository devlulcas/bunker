import * as auth from '$lib/server/auth';
import * as guestLinks from '$lib/server/auth/guest-links';
import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	// First try to validate regular user session
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	const guestToken = event.cookies.get(guestLinks.guestSessionCookieName);

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
	if (guestToken) {
		const { guestSession, guestLink } = await guestLinks.validateGuestSessionToken(guestToken);

		if (guestSession && guestLink) {
			// Create a guest user object
			event.locals.user = {
				id: `guest_${guestSession.id}`,
				username: guestLink.username,
				role: 'guest' as const
			};
			event.locals.session = null; // No regular session for guests
			return resolve(event);
		} else {
			// Clean up invalid guest session cookie
			event.cookies.delete(guestLinks.guestSessionCookieName, { path: '/' });
		}
	}

	// No valid session found
	event.locals.user = null;
	event.locals.session = null;
	return resolve(event);
};

export const handle: Handle = handleAuth;
