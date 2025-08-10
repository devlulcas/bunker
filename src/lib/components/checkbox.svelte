<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type Props = HTMLInputAttributes & {
		label?: string;
		id?: string;
	};

	const { class: className, label, id, ...props }: Props = $props();
</script>

<label class="flex cursor-pointer items-center" for={id}>
	<input
		{...props}
		{id}
		type="checkbox"
		class={[
			'z-1 size-5 cursor-pointer rounded border-2 border-transparent bg-accent-foreground accent-accent transition-all',
			className
		]}
	/>
	{#if label}
		<span class="ml-2 text-sm font-medium text-muted-foreground">{label}</span>
	{/if}
</label>
