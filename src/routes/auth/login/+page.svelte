<script lang="ts">
	import loginImage from '$lib/assets/login.webp';
	import Button from '$lib/components/button.svelte';
	import ErrorWarning from '$lib/components/error-warning.svelte';
	import InputPassword from '$lib/components/input-password.svelte';
	import Input from '$lib/components/input.svelte';
	import { loginAction } from '$lib/remote/auth/login.remote';
	import IconAt from '@lucide/svelte/icons/at-sign';
	import IconLoader from '@lucide/svelte/icons/loader';
	import IconLock from '@lucide/svelte/icons/lock';

	let formState = $state<{ error: string | null; loading: boolean }>({
		error: null,
		loading: false
	});
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
			{...loginAction.enhance(async ({ submit, form }) => {
				try {
					formState.loading = true;
					formState.error = null;
					await submit();
					form.reset();
				} catch (error) {
					formState.error = String(error);
				} finally {
					formState.loading = false;
				}
			})}
			class="w-full max-w-md space-y-6 rounded-4xl border bg-card/90 px-8 py-12 text-card-foreground shadow-lg backdrop-blur-sm"
		>
			<div class="mb-12 text-center">
				<h1 class="mb-2 text-4xl font-bold">Olá outra vez!</h1>
			</div>

			<Input leftIcon={IconAt} name="username" type="text" placeholder="username" required />

			<InputPassword leftIcon={IconLock} name="password" placeholder="senha" required />

			<Button type="submit" disabled={formState.loading}>
				{#if formState.loading}
					<IconLoader class="h-4 w-4 animate-spin" />
					Carregando...
				{:else}
					Entrar
				{/if}
			</Button>

			{#if formState.error}
				<ErrorWarning message={formState.error} />
			{/if}
		</form>
	</div>
</div>
