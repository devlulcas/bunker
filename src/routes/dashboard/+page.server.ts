import { requireLogin } from '$lib/server/auth/require-login';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};
