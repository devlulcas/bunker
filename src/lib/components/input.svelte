<script lang="ts">
	import type { IconProps } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type Props = HTMLInputAttributes & {
		leftIcon?: Component<IconProps, {}, ''>;
		rightIcon?: Component<IconProps, {}, ''>;
	};

	const { class: className, leftIcon: LeftIcon, rightIcon: RightIcon, ...props }: Props = $props();
</script>

<div class="relative text-muted-foreground">
	{#if LeftIcon}
		<LeftIcon class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
	{/if}

	<input
		{...props}
		class={[
			'w-full rounded-lg border bg-input py-3 pr-4 pl-10 transition-colors focus:border-primary focus:ring-2 focus:ring-primary',
			className
		]}
	/>

	{#if RightIcon}
		<RightIcon class="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform" />
	{/if}
</div>
