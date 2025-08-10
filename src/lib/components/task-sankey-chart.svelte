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

	// Enhanced color scale with better colors
	const colorScale = scaleOrdinal<string, string>().range([
		'#3b82f6', // Blue for All Tasks
		'#f59e0b', // Amber for Active
		'var(--brand-dark)' // Emerald for Completed
	]);

	// Sankey generator
	let sankeyGenerator = $derived(
		sankey<NodeData, LinkData>()
			.nodeWidth(25)
			.nodePadding(20)
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
		<svg {width} height={height + 40}>
			<!-- Links with enhanced styling -->
			{#each sankeyData.links as link}
				<path
					d={linkGenerator(link)}
					fill="none"
					stroke={colorScale(getNodeName(link.source))}
					stroke-opacity="0.7"
					stroke-width={Math.max(3, link.width || 1)}
					class="link"
					class:hidden={link.value === 0}
					style="transform: translateY(5px)"
					stroke-linecap="round"
				/>
			{/each}

			<!-- Nodes with enhanced styling -->
			{#each sankeyData.nodes as node}
				<g
					class="node group"
					class:hidden={node.value === 0}
					transform="translate({node.x0 || 0},{node.y0 || 0})"
				>
					<!-- Node background with shadow effect -->
					<rect
						height={(node.y1 || 0) - (node.y0 || 0) + 10}
						width={(node.x1 || 0) - (node.x0 || 0)}
						fill={colorScale(node.name)}
						class="node-rect"
						rx="8"
						ry="8"
					>
						<title>{node.name}: {node.value}</title>
					</rect>

					<!-- Node text with better positioning and styling -->
					<text
						x={(node.x0 || 0) < width / 2 ? (node.x1 || 0) - (node.x0 || 0) + 8 : -8}
						y={((node.y1 || 0) - (node.y0 || 0)) / 2}
						dy="0.35em"
						text-anchor={(node.x0 || 0) < width / 2 ? 'start' : 'end'}
						class="fill-white text-sm font-semibold drop-shadow-sm"
					>
						{node.name}
					</text>

					<!-- Value text below node name -->
					<text
						x={(node.x0 || 0) < width / 2 ? (node.x1 || 0) - (node.x0 || 0) + 8 : -8}
						y={((node.y1 || 0) - (node.y0 || 0)) / 2 + 16}
						dy="0.35em"
						text-anchor={(node.x0 || 0) < width / 2 ? 'start' : 'end'}
						class="fill-white/80 text-xs font-medium drop-shadow-sm"
					>
						{node.value} tarefas
					</text>
				</g>
			{/each}
		</svg>

		<ul class="mt-6 flex justify-center gap-8">
			{#each data.nodes as node}
				<li class="flex items-center gap-1 text-lg font-medium">
					<span
						class="flex size-[3ch] shrink-0 items-center justify-center rounded leading-none font-bold text-white"
						style="background-color: {colorScale(node.name)}"
					>
						{node.value}
					</span>
					<span class="leading-none text-muted-foreground lowercase">{node.name}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.link {
		transition: stroke-opacity 0.2s ease-out;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));
	}

	.link:hover {
		stroke-opacity: 0.8;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
	}

	.node-rect {
		transition:
			transform 0.2s ease-out,
			filter 0.2s ease-out;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
	}

	.node-rect:hover {
		transform: translateY(-2px);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
	}

	.node text {
		transition: fill 0.15s ease-out;
	}

	.node:hover text {
		fill: white;
	}
</style>
