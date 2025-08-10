import { TODOIST_PROJECT_URL } from '$env/static/private';
import { requireGuest } from '$lib/server/auth/require-login';
import {
	extractProjectId,
	filterOutPrivateLabels,
	getAllProjectTasks,
	type WeekFilter
} from '$lib/server/todoist';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	requireGuest();

	try {
		const projectId = extractProjectId(TODOIST_PROJECT_URL);

		if (!projectId) {
			throw new Error('Invalid Todoist project URL');
		}

		// Get week filter from query parameter, default to 'this'
		const weekFilter = (url.searchParams.get('week') as WeekFilter) || 'this';

		const unfilteredTasks = await getAllProjectTasks(projectId, weekFilter);

		const tasks = {
			all: filterOutPrivateLabels(unfilteredTasks.all),
			active: filterOutPrivateLabels(unfilteredTasks.active),
			completed: filterOutPrivateLabels(unfilteredTasks.completed)
		};

		return {
			tasks,
			weekFilter,
			weekBoundaries: unfilteredTasks.weekBoundaries,
			error: null
		};
	} catch (error) {
		console.error('Error loading Todoist tasks:', error);
		return {
			tasks: null,
			weekFilter: 'this',
			weekBoundaries: null,
			error: error instanceof Error ? error.message : 'Failed to fetch tasks'
		};
	}
};
