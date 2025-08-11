<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/button.svelte';
	import LogoutForm from '$lib/components/logout-form.svelte';
	import IconLoader from '@lucide/svelte/icons/loader';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container mx-auto max-w-6xl p-6">
	<header class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Olá, {page.data.user.username}!</h1>

		<LogoutForm>
			{#snippet children({ isSubmitting })}
				<Button disabled={isSubmitting}>
					{#if isSubmitting}
						<IconLoader class="h-4 w-4 animate-spin" />
						Saindo...
					{:else}
						Sair
					{/if}
				</Button>
			{/snippet}
		</LogoutForm>
	</header>
	{@render children?.()}
</div>
