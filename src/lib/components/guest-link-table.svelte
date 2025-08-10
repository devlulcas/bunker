<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { deleteGuestLinkAction } from '$lib/remote/guest/guest-link.remote';
	import IconCopy from '@lucide/svelte/icons/copy';
	import IconTrash from '@lucide/svelte/icons/trash';

	type Props = {
		links: {
			id: string;
			username: string;
			allowedPages: string;
			durationHours: number;
			createdAt: Date;
			createdBy: string;
		}[];
	};

	let { links }: Props = $props();

	function generateGuestLinkUrl(id: string) {
		return `${window.location.origin}/auth/guest/${id}`;
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<table class="min-w-full divide-y divide-border">
	<thead class="bg-muted-foreground/10">
		<tr>
			<th
				class="rounded-tl-lg px-6 py-3 text-start text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>
				Convidado
			</th>
			<th
				class="px-6 py-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>
				Páginas permitidas
			</th>
			<th
				class="px-6 py-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>
				Duração
			</th>
			<th
				class="px-6 py-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>
				Criado
			</th>
			<th
				class="px-6 py-3 text-center text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>
				URL
			</th>
			<th
				class="rounded-tr-lg px-6 py-3 text-end text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>
				Ações
			</th>
		</tr>
	</thead>
	<tbody class="divide-y divide-border">
		{#each links as link, index}
			<tr class="hover:bg-accent {index % 2 === 0 ? 'bg-muted-foreground/2' : ''}">
				<td class="px-6 py-4 text-start whitespace-nowrap">
					<div class="text-sm font-medium text-card-foreground">{link.username}</div>
				</td>
				<td class="px-6 py-4 text-center text-xs text-primary">
					{link.allowedPages}
				</td>
				<td class="px-6 py-4 text-center whitespace-nowrap">
					<div class="text-sm text-card-foreground">{link.durationHours}h</div>
				</td>
				<td class="px-6 py-4 text-center whitespace-nowrap">
					<div class="text-sm text-card-foreground">
						{new Date(link.createdAt).toLocaleDateString()}
					</div>
				</td>
				<td class="px-6 py-4 text-center whitespace-nowrap">
					<input
						class="max-w-20 overflow-x-scroll text-sm text-card-foreground"
						value={generateGuestLinkUrl(link.id)}
						readonly
					/>
				</td>
				<td class="flex justify-end px-6 py-4">
					<div class="flex space-x-2">
						<Button
							type="button"
							size="icon"
							variant="outline"
							onclick={() => copyToClipboard(generateGuestLinkUrl(link.id))}
							title="Copiar link de convidado"
						>
							<IconCopy class="size-4" />
						</Button>
						<Button
							variant="destructive"
							size="icon"
							onclick={() => deleteGuestLinkAction(link.id)}
							title="Deletar link de convidado"
						>
							<IconTrash class="size-4" />
						</Button>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
