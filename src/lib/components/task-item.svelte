<script lang="ts">
	import {
		formatDate,
		formatLabel,
		formatPriority,
		getPriorityColor,
		PRIORITY_LABELS
	} from '$lib/helpers/formatting';
	import type { Task } from '@doist/todoist-api-typescript';
	import IconCalendar from '@lucide/svelte/icons/calendar';
	import IconCheck from '@lucide/svelte/icons/check';
	import IconCode from '@lucide/svelte/icons/code';
	import IconHome from '@lucide/svelte/icons/home';
	import IconSchool from '@lucide/svelte/icons/school';
	import IconUser from '@lucide/svelte/icons/user';
	import IconUsersRound from '@lucide/svelte/icons/users-round';

	type Props = {
		task: Task;
	};

	let { task }: Props = $props();

	const priorityColor = getPriorityColor(task.priority);
</script>

<article
	class="flex h-full items-start justify-between rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
>
	<div class="flex-1">
		<h3 class="mb-1 font-medium text-foreground" class:line-through={!!task.completedAt}>
			{task.content}
		</h3>
		<div class="flex items-center space-x-4 text-sm text-muted-foreground">
			{#if task.completedAt}
				<span class="flex items-center">
					<IconCheck class="mr-1 size-4" />
					Completado em {formatDate(task.completedAt)}
				</span>
			{/if}

			{#if task.due}
				<span class="flex items-center">
					<IconCalendar class="mr-1 size-4" />
					{task.due.string}
				</span>
			{/if}

			<ul class="flex items-center space-x-2">
				{#each task.labels as label}
					{@const [translatedLabel, typedLabel] = formatLabel(label)}
					<li class="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium">
						{#if typedLabel === 'me'}
							<IconUser class="size-3" />
						{:else if typedLabel === 'work'}
							<IconCode class="size-3" />
						{:else if typedLabel === 'home'}
							<IconHome class="size-3" />
						{:else if typedLabel === 'family'}
							<IconUsersRound class="size-3" />
						{:else if typedLabel === 'friends'}
							<IconUsersRound class="size-3" />
						{:else if typedLabel === 'school'}
							<IconSchool class="size-3" />
						{/if}

						{translatedLabel}
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="flex items-center space-x-2">
		{#if task.priority > 0}
			<span
				class="bg-opacity-10 flex items-center justify-center rounded-full px-1.5 pt-[3px] pb-[2px] font-mono text-xs leading-none font-medium {priorityColor}"
			>
				{PRIORITY_LABELS[formatPriority(task.priority)]}
			</span>
		{/if}
	</div>
</article>
