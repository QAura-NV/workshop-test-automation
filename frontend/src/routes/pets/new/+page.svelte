<script lang="ts">
	import { getPocketBase } from '$lib/services/pocketbase';
	import { Control, Description, Field, FieldErrors, Label } from 'formsnap';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { petCreateSchema } from '$lib/schemas/pet.schema';
	import { goto } from '$app/navigation';

	const categories = getPocketBase().collection('categories').getFullList({
		sort: '-created'
	});

	const form = superForm(defaults(zod(petCreateSchema)), {
		id: 'pet-create-form',
		SPA: true,
		validators: zodClient(petCreateSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) return;

			try {
				await getPocketBase()
					.collection('pets')
					.create({
						...form.data
					});
				await goto('/pets');
			} catch (error) {
				setError(form, JSON.stringify(error));
			}
		}
	});

	const { form: formData, constraints, enhance, submitting, delayed, allErrors } = form;

	let formErrors = $derived(
		$allErrors.filter((error) => error.path === '_errors').flatMap((error) => error.messages)
	);
</script>

<div class="mb-4 flex items-center justify-between gap-4 bg-gray-100">
	<h1 class="px-4 py-2 text-xl">New Pet</h1>
	<a class="bg-blue-400 px-4 py-2" href="/pets">Back</a>
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
<form method="POST" use:enhance class="grid grid-cols-2 gap-4">
	<div class="flex flex-col gap-2">
		<Field {form} name="name">
			<Control>
				{#snippet children({ props })}
					<Label>Name</Label>
					<input {...props} {...$constraints.name} type="text" bind:value={$formData.name} />
				{/snippet}
			</Control>
			<Description>Enter the pet name.</Description>
			<FieldErrors class="text-red-400" />
		</Field>
	</div>

	<div class="flex flex-col gap-2">
		<Field {form} name="category">
			<Control>
				{#snippet children({ props })}
					<Label>Category</Label>
					{#await categories}
						<p>Loading categories...</p>
					{:then categories}
						<select {...props} {...$constraints.name} bind:value={$formData.category}>
							{#each categories as category}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>
					{/await}
				{/snippet}
			</Control>
			<Description>Enter the pet name.</Description>
			<FieldErrors class="text-red-400" />
		</Field>
	</div>

	<div class="col-span-2">
		<button
			type="submit"
			disabled={$submitting}
			class="cursor-pointer bg-blue-400 px-4 py-2 disabled:bg-gray-400"
		>
			Create
		</button>
	</div>
</form>
