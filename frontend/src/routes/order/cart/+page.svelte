<script lang="ts">
	import { getPocketBase } from '$lib/services/pocketbase';
	import pictureNotFound from '$lib/assets/picture-not-found.png';
	import type { PetSchema } from '$lib/schemas/pet.schema';
	import { getCartStore } from '$lib/stores/cart.store.svelte';
	import { orderCreateSchema } from '$lib/schemas/order.schema';
	import { getAuthStore } from '$lib/stores/auth.store.svelte';
	import { goto } from '$app/navigation';

	const authStore = getAuthStore();
	const cartStore = getCartStore();

	const pets = getPocketBase().collection('pets').getFullList({
		sort: '-created',
		filter: `status = 'available'`
	});

	const categories = getPocketBase().collection('categories').getFullList({
		sort: '-created'
	});

	const getPictureUrl = (record: PetSchema, asset: string) => {
		return getPocketBase().files.getURL(record, asset);
	};

	const order = async () => {
		const order = await getPocketBase()
			.collection('orders')
			.create(
				orderCreateSchema.parse({
					pets: cartStore.cart,
					status: 'placed',
					user: authStore.id
				})
			);

		cartStore.clearCart();
		await goto(`/order/${order.id}`);
	};
</script>

<div class="mb-4 flex items-center justify-between gap-4 bg-gray-100">
	<h1 class="px-4 py-2 text-xl">Cart</h1>
</div>
{#await pets}
	<p>Loading pets...</p>
{:then pets}
	<div class="flex flex-col gap-4">
		{#each cartStore.cart.map((item) => pets.find((pet) => pet.id === item)) as pet}
			{#if pet}
				<div class="flex border bg-gray-100">
					<div class="max-w-[100px]">
						{#if pet.photos?.length !== 0}
							<img src={getPictureUrl(pet, pet.photos![0])} alt={pet.photos![0]} />
						{:else}
							<img src={pictureNotFound} alt="Not found" />
						{/if}
					</div>
					<div class="px-4 py-2">
						<p class="text-lg font-bold">{pet.name}</p>
						{#await categories}
							<p>Loading categories...</p>
						{:then categories}
							<p>{categories.find((category) => category.id === pet.category)?.name}</p>
						{/await}
						<p>{pet.status[0].toUpperCase() + pet.status.slice(1)}</p>
					</div>
				</div>
			{/if}
		{/each}
		<div class="flex justify-end">
			<button class="cursor-pointer bg-blue-400 px-4 py-2" onclick={() => order()}>Order now</button
			>
		</div>
	</div>
{:catch error}
	<p class="bg-red-400">Error loading pets: {error}</p>
{/await}
