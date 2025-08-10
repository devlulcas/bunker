<script lang="ts">
	import { goto } from '$app/navigation';
	import ButtonToggle from '$lib/components/button-toggle.svelte';
	import TaskItem from '$lib/components/task-item.svelte';
	import TaskSankeyChart from '$lib/components/task-sankey-chart.svelte';
	import { formatDate } from '$lib/helpers/formatting';
	import IconSkull from '@lucide/svelte/icons/skull';

	const { data } = $props();

	function setWeekFilter(week: 'this' | 'last') {
		const url = new URL(window.location.href);
		url.searchParams.set('week', week);
		goto(url.toString());
	}
</script>

<svelte:head>
	<title>Tarefas extraídas do Todoist</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Tarefas extraídas do Todoist</h1>

	{#if data.error}
		<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
			<div class="flex">
				<IconSkull class="size-5 flex-shrink-0 text-red-400" />
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Erro</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{data.error}</p>
					</div>
				</div>
			</div>
		</div>
	{:else if data.tasks}
		<!-- Week Filter -->
		<div class="mb-6">
			<div class="flex items-center gap-4">
				<div class="flex gap-2">
					<ButtonToggle
						label="Essa semana"
						onClick={() => setWeekFilter('this')}
						active={data.weekFilter === 'this'}
					/>
					<ButtonToggle
						label="Última semana"
						onClick={() => setWeekFilter('last')}
						active={data.weekFilter === 'last'}
					/>
				</div>
				{#if data.weekBoundaries}
					<span class="text-sm text-gray-600">
						{formatDate(data.weekBoundaries.start, 'short')} -
						{formatDate(data.weekBoundaries.end, 'short')}
					</span>
				{/if}
			</div>
		</div>

		<div class="space-y-6">
			<!-- Active Tasks -->
			<section>
				<h2 class="mb-4 flex items-center text-xl font-semibold text-gray-800">
					<span class="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
					Tasks ({data.tasks.all.length})
				</h2>
				{#if data.tasks.all.length > 0}
					<ul class="flex flex-col gap-4">
						{#each data.tasks.all as task, index}
							<li>
								<TaskItem {task} />
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-gray-500 italic">Nenhuma tarefa ativa encontrada.</p>
				{/if}
			</section>

			<!-- Summary -->
			<TaskSankeyChart tasks={data.tasks.all} />
		</div>
	{:else}
		<div class="py-12 text-center">
			<p class="text-gray-500">Nenhuma tarefa encontrada.</p>
		</div>
	{/if}
</div>
