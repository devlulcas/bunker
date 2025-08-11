<script lang="ts">
	import { logoutAction } from '$lib/remote/auth/logout.remote';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet<[{ isSubmitting: boolean }]>;
		class?: string;
	};

	let { children, class: className }: Props = $props();

	let formState = $state<{ error: string | null; loading: boolean }>({
		error: null,
		loading: false
	});
</script>

<form
	{...logoutAction.enhance(async ({ submit }) => {
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
	class={className}
>
	{@render children({ isSubmitting: formState.loading })}
</form>
