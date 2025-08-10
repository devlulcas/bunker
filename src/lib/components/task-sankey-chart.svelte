<script lang="ts">
	import type { Task } from '@doist/todoist-api-typescript';
	import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
	import { scaleOrdinal } from 'd3-scale';

	type Props = {
		tasks: Task[];
	};

	let { tasks }: Props = $props();

	// Data and dimensions
	type NodeData = {
		name: string;
		value: number;
	};

	type LinkData = {
		source: number;
		target: number;
		value: number;
	};

	let data = $derived<{ nodes: NodeData[]; links: LinkData[] }>({
		nodes: [
			{ name: 'Todas', value: tasks.length },
			{ name: 'Ativas', value: tasks.length - tasks.filter((task) => task.completedAt).length },
			{ name: 'Completas', value: tasks.filter((task) => task.completedAt).length }
		],
		links: [
			{
				source: 0,
				target: 1,
				value: tasks.length - tasks.filter((task) => task.completedAt).length
			},
			{ source: 0, target: 2, value: tasks.filter((task) => task.completedAt).length }
		]
	});

	let width = $state(800);
	const height = 600;
	const margin = { top: 0, right: 0, bottom: 0, left: 0 };

	// Color scale for nodes
	const colorScale = scaleOrdinal<string, string>().range([
		'var(--chart-4)',
		'var(--chart-2)',
		'var(--chart-5)'
	]);

	// Sankey generator
	let sankeyGenerator = $derived(
		sankey<NodeData, LinkData>()
			.nodeWidth(15)
			.nodePadding(10)
			.extent([
				[margin.left, margin.top],
				[width - margin.right, height - margin.bottom]
			])
	);

	// Process data through sankey generator
	let sankeyData = $derived(
		sankeyGenerator({
			nodes: data.nodes.map((d) => ({ ...d })),
			links: data.links.map((d) => ({ ...d }))
		})
	);

	// Link generator
	const linkGenerator = sankeyLinkHorizontal();

	// Helper function to get node name safely
	function getNodeName(node: any): string {
		return typeof node === 'object' && node.name ? node.name : 'Unknown';
	}
</script>

<div class="relative w-full" bind:clientWidth={width}>
	{#if sankeyData}
		<svg {width} {height}>
			<!-- Links -->
			{#each sankeyData.links as link}
				<path
					d={linkGenerator(link)}
					fill="none"
					stroke={colorScale(getNodeName(link.source))}
					stroke-opacity="0.4"
					stroke-width={Math.max(1, link.width || 1)}
					class="link"
				/>
			{/each}

			<!-- Nodes -->
			{#each sankeyData.nodes as node}
				<g class="node" transform="translate({node.x0 || 0},{node.y0 || 0})">
					<rect
						height={(node.y1 || 0) - (node.y0 || 0)}
						width={(node.x1 || 0) - (node.x0 || 0)}
						fill={colorScale(node.name)}
						class="node-rect"
					>
						<title>{node.name}: {node.value}</title>
					</rect>

					<text
						x={(node.x0 || 0) < width / 2 ? (node.x1 || 0) - (node.x0 || 0) + 6 : -6}
						y={((node.y1 || 0) - (node.y0 || 0)) / 2}
						dy="0.35em"
						text-anchor={(node.x0 || 0) < width / 2 ? 'start' : 'end'}
						class="fill-primary text-sm group-hover:fill-primary-foreground"
					>
						{node.name}
					</text>
				</g>
			{/each}
		</svg>
	{/if}
</div>

<style>
	.link {
		transition: stroke-opacity 200ms ease-in-out;
	}

	.link:hover {
		stroke-opacity: 0.8;
	}

	.node-rect {
		transition: opacity 200ms ease-in-out;
		opacity: 0.8;
	}

	.node-rect:hover {
		opacity: 1;
	}
</style>
