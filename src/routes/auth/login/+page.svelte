<script lang="ts">
	import { enhance } from '$app/forms';
	import loginImage from '$lib/assets/login.webp';
	import Button from '$lib/components/button.svelte';
	import IconAt from '@lucide/svelte/icons/at-sign';
	import IconEye from '@lucide/svelte/icons/eye';
	import IconEyeOff from '@lucide/svelte/icons/eye-off';
	import IconLock from '@lucide/svelte/icons/lock';

	let { form } = $props();
	let showPassword = $state(false);

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="flex min-h-screen bg-background">
	<!-- Left Section - Visual Background -->
	<div class="relative hidden overflow-hidden p-4 lg:flex lg:w-1/2">
		<img
			src={loginImage}
			alt="Login"
			class="h-full w-full rounded-4xl object-cover brightness-90 contrast-125 saturate-150"
		/>
	</div>

	<!-- Right Section - Login Form -->
	<div class="fixed inset-0 flex flex-1 items-center justify-center">
		<form
			method="post"
			action="?/login"
			use:enhance
			class="w-full max-w-md space-y-6 rounded-4xl border bg-card/90 px-8 py-12 text-card-foreground shadow-lg backdrop-blur-sm"
		>
			<div class="mb-12 text-center">
				<h1 class="mb-2 text-4xl font-bold">Olá outra vez!</h1>
			</div>

			<!-- Email Field -->
			<div class="space-y-2">
				<div class="relative text-muted-foreground">
					<IconAt class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
					<input
						name="username"
						type="text"
						placeholder="username"
						class="w-full rounded-lg border bg-input py-3 pr-4 pl-10 transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
			</div>

			<!-- Password Field -->
			<div class="space-y-2">
				<div class="relative text-muted-foreground">
					<IconLock class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
					<input
						name="password"
						type={showPassword ? 'text' : 'password'}
						placeholder="senha"
						class="w-full rounded-lg border bg-input py-3 pr-4 pl-10 transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
						required
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
			</div>

			<!-- Login Button -->
			<Button type="submit">Entrar</Button>

			<!-- Register Link -->
			{#if form?.message}
				<div class="mt-6 rounded-lg border border-destructive bg-destructive/10 p-4">
					<p class="text-center text-sm text-destructive">{form.message}</p>
				</div>
			{/if}
		</form>
	</div>
</div>
