<script lang="ts">
	import TaskItem from '$lib/components/task-item.svelte';
	import IconSkull from '@lucide/svelte/icons/skull';

	const { data } = $props();
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
		<div class="space-y-6">
			<!-- Active Tasks -->
			<section>
				<h2 class="mb-4 flex items-center text-xl font-semibold text-gray-800">
					<span class="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
					Tasks ({data.tasks.all.length})
				</h2>
				{#if data.tasks.all.length > 0}
					<ul
						class="task-list"
						style:--numcards={data.tasks.all.length}
						style:view-timeline-name="--cards-element-scrolls-in-body"
					>
						{#each data.tasks.all as task, index}
							<li class="task-item" style:--index={index}>
								<TaskItem {task} />
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-gray-500 italic">Nenhuma tarefa ativa encontrada.</p>
				{/if}
			</section>

			<!-- Summary -->
			<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<h3 class="mb-2 text-sm font-medium text-blue-800">Resumo</h3>
				<div class="grid grid-cols-3 gap-4 text-sm">
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">{data.tasks.all.length}</div>
						<div class="text-blue-700">Total de tarefas</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">{data.tasks.active.length}</div>
						<div class="text-green-700">Ativas</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-gray-600">{data.tasks.completed.length}</div>
						<div class="text-gray-700">Completadas</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="py-12 text-center">
			<p class="text-gray-500">Nenhuma tarefa encontrada.</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	@supports (animation-timeline: view()) {
		@keyframes scale {
			to {
				transform: scale(calc(1.1 - calc(0.1 * var(--reverse-index))));
			}
		}

		.task-list {
			--card-height: 100px;
			--card-margin: 1rem;
			--card-top-offset: 1em;
			padding-bottom: calc(var(--numcards) * var(--card-top-offset));
			margin-bottom: var(--card-margin);
			list-style: none;
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: repeat(var(--numcards), var(--card-height));
			gap: var(--card-margin);
			view-timeline-name: --cards-element-scrolls-in-body;
		}

		.task-item {
			position: sticky;
			top: 0;
			padding-top: calc(var(--index) * var(--card-top-offset));
			--index0: calc(var(--index) - 1);
			--reverse-index: calc(var(--numcards) - var(--index0));
			--reverse-index0: calc(var(--reverse-index) - 1);
		}

		:global(.task-item-content) {
			transform-origin: 50% 0%;
			will-change: transform;
			--start-range: calc(var(--index0) / var(--numcards) * 100%);
			--end-range: calc((var(--index)) / var(--numcards) * 100%);
			animation: linear scale forwards;
			animation-timeline: --cards-element-scrolls-in-body;
			animation-range: exit-crossing var(--start-range) exit-crossing var(--end-range);
		}
	}
</style>
