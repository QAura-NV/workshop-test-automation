<script lang="ts">
	import { goto } from '$app/navigation';
	import { getPocketBase } from '$lib/services/pocketbase';
	import { getAuthStore } from '$lib/stores/auth.store.svelte';
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap';
	import { ClientResponseError } from 'pocketbase';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const authStore = getAuthStore();

	const registerSchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(4),
		admin: z.boolean().default(false)
	});

	const form = superForm(defaults(zod(registerSchema)), {
		id: 'register-form',
		SPA: true,
		validators: zodClient(registerSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) return;

			const { name, email, password, admin } = form.data;

			try {
				await getPocketBase().collection('users').create({
					name,
					email,
					password,
					passwordConfirm: password,
					admin
				});
				await authStore.authWithPassword(email, password);
				await goto('/');
			} catch (error) {
				if (error instanceof ClientResponseError) {
					setError(form, error.message);
				} else {
					setError(
						form,
						`An unexpected error occurred. Please try again later. (${JSON.stringify(error)})`
					);
				}
			}
		}
	});

	const { form: formData, constraints, enhance, submitting, delayed, allErrors } = form;

	let formErrors = $derived(
		$allErrors.filter((error) => error.path === '_errors').flatMap((error) => error.messages)
	);
</script>

<div class="mb-4 flex items-center justify-between gap-4 bg-gray-100">
	<h1 class="px-4 py-2 text-xl">Register</h1>
</div>
{#if formErrors.length > 0}
	<div class="bg-red-400 px-4 py-2">
		<p>There were errors with your submission:</p>
		<ul class="list-disc px-8">
			{#each formErrors as error}
				<li>{error}</li>
			{/each}
		</ul>
	</div>
{/if}
<form method="POST" use:enhance class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<Field {form} name="name">
			<Control>
				{#snippet children({ props })}
					<Label>Name</Label>
					<input
						{...props}
						{...$constraints.name}
						type="text"
						autocomplete="name"
						bind:value={$formData.name}
					/>
				{/snippet}
			</Control>
			<Description>Enter your name.</Description>
			<FieldErrors class="text-red-400" />
		</Field>
	</div>

	<div class="flex flex-col gap-2">
		<Field {form} name="email">
			<Control>
				{#snippet children({ props })}
					<Label>Email</Label>
					<input
						{...props}
						{...$constraints.email}
						type="text"
						autocomplete="email"
						bind:value={$formData.email}
					/>
				{/snippet}
			</Control>
			<Description>Enter your email address.</Description>
			<FieldErrors class="text-red-400" />
		</Field>
	</div>

	<div class="flex flex-col gap-2">
		<Field {form} name="password">
			<Control>
				{#snippet children({ props })}
					<Label>Password</Label>
					<input
						{...props}
						{...$constraints.password}
						type="password"
						autocomplete="current-password"
						bind:value={$formData.password}
					/>
				{/snippet}
			</Control>
			<Description>Enter your password.</Description>
			<FieldErrors class="text-red-400" />
		</Field>
	</div>

	<div class="flex flex-col gap-2">
		<Field {form} name="admin">
			<Control>
				{#snippet children({ props })}
					<div class="flex items-center gap-2 border px-4 py-2">
						<input
							{...props}
							{...$constraints.admin}
							type="checkbox"
							bind:checked={$formData.admin}
						/>
						<Label for={props.id}>Admin</Label>
					</div>
				{/snippet}
			</Control>
			<Description>Wanna be an admin?</Description>
			<FieldErrors class="text-red-400" />
		</Field>
	</div>

	<div class="col-span-2">
		<button
			type="submit"
			disabled={$submitting}
			class="cursor-pointer bg-blue-400 px-4 py-2 disabled:bg-gray-400"
		>
			Register
		</button>
	</div>
</form>
