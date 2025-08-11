import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		const route = event.locals.user.role === 'admin' ? '/dashboard' : '/guest';
		redirect(302, route);
	}

	return {};
};
