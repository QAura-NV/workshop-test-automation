<script lang="ts">
	import { getPocketBase } from '$lib/services/pocketbase';
	import pictureNotFound from '$lib/assets/picture-not-found.png';
	import type { PetSchema } from '$lib/schemas/pet.schema';
	import { getAuthStore } from '$lib/stores/auth.store.svelte';
	import { getCartStore } from '$lib/stores/cart.store.svelte';

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
</script>

<div class="mb-4 flex items-center justify-between gap-4 bg-gray-100">
	<h1 class="px-4 py-2 text-xl">Pets</h1>
	{#if authStore.admin}
		<a class="bg-blue-400 px-4 py-2" href="/pets/new">New pet</a>
	{/if}
</div>
{#await pets}
	<p>Loading pets...</p>
{:then pets}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
		{#each pets as pet}
			<div class="border bg-gray-100">
				{#if pet.photos?.length !== 0}
					<img src={getPictureUrl(pet, pet.photos![0])} alt={pet.photos![0]} />
				{:else}
					<img src={pictureNotFound} alt="Not found" />
				{/if}

				<div class="px-4 py-2">
					<p class="text-lg font-bold">{pet.name}</p>
					{#await categories}
						<p>Loading categories...</p>
					{:then categories}
						<p>{categories.find((category) => category.id === pet.category)?.name}</p>
					{/await}
					<p>{pet.status[0].toUpperCase() + pet.status.slice(1)}</p>
					{#if cartStore.isInCart(pet.id)}
						<button
							class="mt-2 w-full cursor-pointer bg-red-400 px-4 py-2"
							onclick={() => cartStore.removeFromCart(pet.id)}
						>
							Remove from cart
						</button>
					{/if}
					{#if !cartStore.isInCart(pet.id)}
						<button
							class="mt-2 w-full cursor-pointer bg-blue-400 px-4 py-2"
							onclick={() => cartStore.addToCart(pet.id)}
						>
							Add to cart
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<p class="text-right">Showing a total of {pets.length} pets</p>
{:catch error}
	<p class="bg-red-400">Error loading pets: {error}</p>
{/await}
