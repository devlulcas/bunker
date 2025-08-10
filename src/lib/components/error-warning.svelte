<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div class="mt-6 rounded-lg border border-destructive bg-destructive/10 p-4">
	<p class="text-center text-sm text-destructive">{message}</p>
</div>
