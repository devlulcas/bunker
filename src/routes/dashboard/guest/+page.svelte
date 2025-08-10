<script lang="ts">
	import IconExternalLink from '@lucide/svelte/icons/external-link';

	const { data } = $props();
</script>

<div class="container mx-auto max-w-6xl p-6">
	<h1 class="mb-8 text-3xl font-bold">Painel de controle</h1>

	<div class="rounded-3xl bg-card p-6 text-card-foreground shadow-md">
		<h3 class="mb-4 text-lg font-medium">Páginas permitidas</h3>

		<ul class="list-disc pl-4">
			{#each JSON.parse(data.user.allowedPages) as page}
				{#if page === '*'}
					<li class="mb-2">
						<span class="text-sm text-primary">Todas as páginas</span>
					</li>
				{:else}
					<li class="mb-2">
						<a href={page} class="text-sm text-primary">{page} <IconExternalLink /></a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>
