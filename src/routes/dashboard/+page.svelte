<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Checkbox from '$lib/components/checkbox.svelte';
	import ErrorWarning from '$lib/components/error-warning.svelte';
	import GuestLinkTable from '$lib/components/guest-link-table.svelte';
	import Input from '$lib/components/input.svelte';
	import { createGuestLinkAction, getGuestLinksAction } from '$lib/remote/guest/guest-link.remote';
	import IconAt from '@lucide/svelte/icons/at-sign';
	import IconClock from '@lucide/svelte/icons/clock';
	import IconLoader from '@lucide/svelte/icons/loader';

	const availablePages = ['/dashboard/guest/todoist'];

	let formState = $state<{ error: string | null; loading: boolean }>({
		error: null,
		loading: false
	});
</script>

<form
	{...createGuestLinkAction.enhance(async ({ submit }) => {
		try {
			formState.loading = true;
			formState.error = null;
			await submit();
		} catch (error) {
			formState.error = String(error);
		} finally {
			formState.loading = false;
		}
	})}
	class="mb-8 rounded-4xl bg-card p-6 text-card-foreground shadow-md"
>
	<div class="rounded-3xl border p-6">
		<h3 class="mb-4 text-lg font-medium">Criar novo link de convidado</h3>

		<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<label for="username" class="mb-2 block text-sm font-medium"> Usuário * </label>
				<Input leftIcon={IconAt} name="username" type="text" placeholder="usuário" required />
			</div>

			<div>
				<label for="duration" class="mb-2 block text-sm font-medium"> Duração (horas) * </label>
				<Input leftIcon={IconClock} name="duration" type="number" placeholder="duração" required />
			</div>
		</div>

		<fieldset class="mb-4">
			<legend class="mb-2 block text-sm font-medium">Páginas permitidas *</legend>
			<div class="space-y-2">
				{#each availablePages as page}
					<Checkbox name="pages" value={page} label={page} id={page} />
				{/each}
			</div>
		</fieldset>

		<Button type="submit" class="mt-8 w-full" disabled={formState.loading}>
			{#if formState.loading}
				<IconLoader class="h-4 w-4 animate-spin" />
				Criando link de convidado...
			{:else}
				Criar link de convidado
			{/if}
		</Button>

		{#if formState.error}
			<ErrorWarning message={formState.error} />
		{/if}
	</div>
</form>

<div class="rounded-3xl bg-card p-6 text-card-foreground shadow-md">
	<h3 class="mb-4 text-lg font-medium">Links de convidado existentes</h3>

	{#await getGuestLinksAction()}
		<p class="flex items-center justify-center gap-2 py-8 text-center">
			<IconLoader class="h-4 w-4 animate-spin" />
			Carregando links de convidado...
		</p>
	{:then result}
		{#if result.error}
			<ErrorWarning message={result.error} />
		{:else}
			{@const links = result.links ?? []}

			<div class="overflow-x-auto rounded-lg border">
				<GuestLinkTable {links} />
			</div>
		{/if}
	{/await}
</div>
