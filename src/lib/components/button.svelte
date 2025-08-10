<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export type Props = HTMLButtonAttributes & {
		children: Snippet;
	};

	const { class: className, ...props }: Props = $props();
</script>

<button
	{...props}
	class={[
		'shiny-gradient z-1 w-full cursor-pointer rounded-lg px-4 py-2 font-medium text-white transition-colors',
		className
	]}
>
	{@render props.children?.()}
</button>
