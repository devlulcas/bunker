<script lang="ts">
	import type { IconProps } from '@lucide/svelte';
	import IconEye from '@lucide/svelte/icons/eye';
	import IconEyeOff from '@lucide/svelte/icons/eye-off';
	import type { Component } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type Props = Omit<HTMLInputAttributes, 'type'> & {
		leftIcon?: Component<IconProps, {}, ''>;
		rightIcon?: Component<IconProps, {}, ''>;
	};

	const { class: className, leftIcon: LeftIcon, rightIcon: RightIcon, ...props }: Props = $props();

	let showPassword = $state(false);

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="relative text-muted-foreground">
	{#if LeftIcon}
		<LeftIcon class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
	{/if}

	<input
		{...props}
		type={showPassword ? 'text' : 'password'}
		class={[
			'w-full rounded-lg border bg-input py-3 pr-4 pl-10 transition-colors focus:border-primary focus:ring-2 focus:ring-primary',
			className
		]}
	/>

	<button
		type="button"
		onclick={togglePassword}
		class="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-primary"
	>
		{#if showPassword}
			<IconEyeOff class="h-5 w-5" />
		{:else}
			<IconEye class="h-5 w-5" />
		{/if}
	</button>
</div>
