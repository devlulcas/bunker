<script lang="ts">
	const { data } = $props();

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}

	function formatPriority(priority: number) {
		const priorities = ['', 'Low', 'Medium', 'High', 'Urgent'];
		return priorities[priority] || 'None';
	}

	function getPriorityColor(priority: number) {
		const colors = ['', 'text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600'];
		return colors[priority] || 'text-gray-600';
	}
</script>

<svelte:head>
	<title>Todoist Tasks</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Todoist Tasks</h1>

	{#if data.error}
		<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{data.error}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
			<h3 class="mb-2 text-sm font-medium text-blue-800">How to use:</h3>
			<p class="mb-2 text-sm text-blue-700">Add your Todoist project URL as a query parameter:</p>
			<code class="rounded bg-blue-100 px-2 py-1 text-xs">
				/todoist?url=https://app.todoist.com/app/project/your-project-id
			</code>
		</div>
	{:else if data.tasks}
		<div class="space-y-6">
			<!-- Active Tasks -->
			<div>
				<h2 class="mb-4 flex items-center text-xl font-semibold text-gray-800">
					<span class="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
					Active Tasks ({data.tasks.active.length})
				</h2>
				{#if data.tasks.active.length > 0}
					<div class="space-y-3">
						{#each data.tasks.active as task}
							<div
								class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
							>
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h3 class="mb-1 font-medium text-gray-900">{task.content}</h3>
										<div class="flex items-center space-x-4 text-sm text-gray-600">
											{#if task.due}
												<span class="flex items-center">
													<svg
														class="mr-1 h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
														/>
													</svg>
													{task.due.string}
												</span>
											{/if}
											<span class="flex items-center">
												<svg
													class="mr-1 h-4 w-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
													/>
												</svg>
												{formatPriority(task.priority)}
											</span>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										{#if task.priority > 0}
											<span
												class="rounded-full px-2 py-1 text-xs font-medium {getPriorityColor(
													task.priority
												)} bg-opacity-10"
											>
												P{task.priority}
											</span>
										{/if}
										<a
											href={task.url}
											target="_blank"
											rel="noopener noreferrer"
											class="text-blue-600 hover:text-blue-800"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
												/>
											</svg>
										</a>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 italic">No active tasks found.</p>
				{/if}
			</div>

			<!-- Completed Tasks -->
			<div>
				<h2 class="mb-4 flex items-center text-xl font-semibold text-gray-800">
					<span class="mr-2 h-3 w-3 rounded-full bg-gray-400"></span>
					Completed Tasks ({data.tasks.completed.length})
				</h2>
				{#if data.tasks.completed.length > 0}
					<div class="space-y-3">
						{#each data.tasks.completed as task}
							<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h3 class="mb-1 font-medium text-gray-600 line-through">{task.content}</h3>
										<div class="flex items-center space-x-4 text-sm text-gray-500">
											{#if task.completedAt}
												<span class="flex items-center">
													<svg
														class="mr-1 h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													Completed {formatDate(task.completedAt)}
												</span>
											{/if}
											{#if task.due}
												<span class="flex items-center">
													<svg
														class="mr-1 h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
														/>
													</svg>
													{task.due.string}
												</span>
											{/if}
										</div>
									</div>
									<div class="flex items-center space-x-2">
										{#if task.priority > 0}
											<span
												class="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-500"
											>
												P{task.priority}
											</span>
										{/if}
										<a
											href={task.url}
											target="_blank"
											rel="noopener noreferrer"
											class="text-gray-500 hover:text-gray-700"
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
												/>
											</svg>
										</a>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 italic">No completed tasks found.</p>
				{/if}
			</div>

			<!-- Summary -->
			<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<h3 class="mb-2 text-sm font-medium text-blue-800">Summary</h3>
				<div class="grid grid-cols-3 gap-4 text-sm">
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">{data.tasks.all.length}</div>
						<div class="text-blue-700">Total Tasks</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">{data.tasks.active.length}</div>
						<div class="text-green-700">Active</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-gray-600">{data.tasks.completed.length}</div>
						<div class="text-gray-700">Completed</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="py-12 text-center">
			<p class="text-gray-500">No tasks loaded. Add a project URL to get started.</p>
		</div>
	{/if}
</div>
