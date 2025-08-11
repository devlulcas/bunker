<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Fusca</title>
	<meta name="description" content="there might be dragons" />
	<meta name="robots" content="noindex" />
	<meta name="author" content="Lucas Alves Rego" />
	<meta name="theme-color" content="#000000" />
</svelte:head>

{@render children?.()}
