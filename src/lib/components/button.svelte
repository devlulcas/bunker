<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export type Props = HTMLButtonAttributes & {
		children: Snippet;
		variant?: 'default' | 'destructive' | 'outline';
		size?: 'default' | 'icon';
	};

	const { class: className, variant = 'default', size = 'default', ...props }: Props = $props();
</script>

<button
	{...props}
	class={[
		'z-1 flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors',
		variant === 'destructive' &&
			'bg-destructive text-destructive-foreground hover:bg-destructive/90',
		variant === 'outline' &&
			'border border-muted-foreground bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',
		variant === 'default' && 'shiny-gradient text-white',
		size === 'icon' && 'h-9 w-9 p-2',
		size === 'default' && 'h-9 w-full px-4 py-2',
		className
	]}
>
	{@render props.children?.()}
</button>
