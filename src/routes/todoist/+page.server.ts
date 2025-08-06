import { TODOIST_PROJECT_URL } from '$env/static/private';
import { extractProjectId, filterOutPrivateLabels, getAllProjectTasks } from '$lib/server/todoist';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const projectId = extractProjectId(TODOIST_PROJECT_URL);

		if (!projectId) {
			throw new Error('Invalid Todoist project URL');
		}

		const unfilteredTasks = await getAllProjectTasks(projectId);

		const tasks = {
			all: filterOutPrivateLabels(unfilteredTasks.all),
			active: filterOutPrivateLabels(unfilteredTasks.active),
			completed: filterOutPrivateLabels(unfilteredTasks.completed)
		};

		return {
			tasks,
			error: null
		};
	} catch (error) {
		console.error('Error loading Todoist tasks:', error);
		return {
			tasks: null,
			error: error instanceof Error ? error.message : 'Failed to fetch tasks'
		};
	}
};
