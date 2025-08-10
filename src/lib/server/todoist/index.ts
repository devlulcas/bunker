import { env } from '$env/dynamic/private';
import { TodoistApi, type Task } from '@doist/todoist-api-typescript';

if (!env.TODOIST_API_TOKEN) throw new Error('TODOIST_API_TOKEN is not set');

export const todoistApi = new TodoistApi(env.TODOIST_API_TOKEN);

export function extractProjectId(url: string): string | null {
	const projectId = new URL(url).pathname.split('/').pop()?.split('-').pop();
	return projectId || null;
}

export type WeekFilter = 'this' | 'last';

export function getWeekBoundaries(weekFilter: WeekFilter): { start: Date; end: Date } {
	const now = new Date();
	const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

	// Get the start of the current week (Monday)
	const startOfCurrentWeek = new Date(now);
	startOfCurrentWeek.setDate(now.getDate() - currentDay);
	startOfCurrentWeek.setHours(0, 0, 0, 0);

	// Get the end of the current week (Sunday)
	const endOfCurrentWeek = new Date(startOfCurrentWeek);
	endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - currentDay + 6);
	endOfCurrentWeek.setHours(23, 59, 59, 999);

	if (weekFilter === 'this') {
		return {
			start: startOfCurrentWeek,
			end: endOfCurrentWeek
		};
	} else {
		// Last week
		const startOfLastWeek = new Date(startOfCurrentWeek);
		startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);

		const endOfLastWeek = new Date(startOfCurrentWeek);
		endOfLastWeek.setDate(startOfCurrentWeek.getDate() - 1);
		endOfLastWeek.setHours(23, 59, 59, 999);

		return {
			start: startOfLastWeek,
			end: endOfLastWeek
		};
	}
}

export async function getAllProjectTasks(projectId: string, weekFilter: WeekFilter = 'this') {
	try {
		// Get active tasks
		const activeTasksResponse = await todoistApi.getTasks({ projectId, limit: 100 });
		const activeTasks = activeTasksResponse.results;

		// Get week boundaries for filtering
		const weekBoundaries = getWeekBoundaries(weekFilter);

		const completedTasksResponse = await todoistApi.getCompletedTasksByCompletionDate({
			projectId,
			since: weekBoundaries.start.toISOString(),
			until: weekBoundaries.end.toISOString(),
			limit: 100
		});

		const completedTasks = completedTasksResponse.items;

		const allTasks = [...activeTasks, ...completedTasks];

		return {
			active: activeTasks,
			completed: completedTasks,
			all: allTasks,
			weekBoundaries
		};
	} catch (error) {
		console.error('Error fetching Todoist tasks:', error);
		throw new Error(`Failed to fetch tasks from project ${projectId}: ${error}`);
	}
}

const PRIVATE_LABELS = ['private', 'personal'];

export function filterOutPrivateLabels(tasks: Task[]) {
	return tasks.filter((task) => {
		return !task.labels.some((label) => PRIVATE_LABELS.includes(label));
	});
}
