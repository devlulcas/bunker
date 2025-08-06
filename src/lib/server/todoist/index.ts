import { env } from '$env/dynamic/private';
import { TodoistApi, type Task } from '@doist/todoist-api-typescript';

if (!env.TODOIST_API_TOKEN) throw new Error('TODOIST_API_TOKEN is not set');

export const todoistApi = new TodoistApi(env.TODOIST_API_TOKEN);

/**
 * Extract project ID from Todoist URL
 * @param url - Todoist project URL
 * @returns Project ID or null if invalid
 */
export function extractProjectId(url: string): string | null {
	const projectId = new URL(url).pathname.split('/').pop()?.split('-').pop();
	return projectId || null;
}

/**
 * Get all tasks from a project, including completed ones
 * @param projectId - Todoist project ID
 * @returns Array of all tasks (active and completed)
 */
export async function getAllProjectTasks(projectId: string) {
	try {
		// Get active tasks
		const activeTasksResponse = await todoistApi.getTasks({ projectId });
		const activeTasks = activeTasksResponse.results;

		const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
		const now = new Date().toISOString();

		const completedTasksResponse = await todoistApi.getCompletedTasksByCompletionDate({
			since: lastWeek,
			until: now
		});

		const completedTasks = completedTasksResponse.items;

		const allTasks = [...activeTasks, ...completedTasks];

		return {
			active: activeTasks,
			completed: completedTasks,
			all: allTasks
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
