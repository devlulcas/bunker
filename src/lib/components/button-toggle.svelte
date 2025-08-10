<script lang="ts">
	export type Props = {
		label: string;
		onClick: () => void;
		active: boolean;
	};

	const { label, onClick, active }: Props = $props();
</script>

<button
	class={[
		'cursor-pointer rounded-lg border px-4 py-2 font-medium transition-colors',
		active && 'shiny-gradient text-primary-foreground'
	]}
	onclick={onClick}
>
	{label}
</button>
