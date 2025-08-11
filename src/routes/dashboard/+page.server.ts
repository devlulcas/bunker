import { requireAdmin } from '$lib/server/auth/require-permission';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const user = requireAdmin();
	return { user };
};
