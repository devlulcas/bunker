// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth/session').SessionValidationResult['user'];
			session: import('$lib/server/auth/session').SessionValidationResult['session'];
			guestLink: import('$lib/server/guest/guest-session').SessionValidationResult['guestLink'];
			guestSession: import('$lib/server/guest/guest-session').SessionValidationResult['guestSession'];
		}
	} // interface Error {}
	// interface Locals {}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export {};
