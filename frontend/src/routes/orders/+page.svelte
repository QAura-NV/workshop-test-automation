<script lang="ts">
	import { getPocketBase } from '$lib/services/pocketbase';
	import { getAuthStore } from '$lib/stores/auth.store.svelte';
	import { getCartStore } from '$lib/stores/cart.store.svelte';

	const authStore = getAuthStore();
	const cartStore = getCartStore();

	const orders = getPocketBase()
		.collection('orders')
		.getFullList({
			sort: '-created',
			filter: `user.id = '${authStore.id}'`
		});
</script>

<div class="mb-4 flex items-center justify-between gap-4 bg-gray-100">
	<h1 class="px-4 py-2 text-xl">My Orders</h1>
</div>
{#await orders}
	<p>Loading orders...</p>
{:then orders}
	<div class="grid grid-cols-1 gap-4">
		{#each orders as order}
			<div class="pb-4">
				<div class="items-between flex border-b border-b-gray-200 pb-4">
					<div class="flex-grow">
						<h2 class="text-lg font-bold">Order ID: {order.id}</h2>

						<p>Last updated at {new Date(order.updated).toLocaleString('nl-BE')}</p>
						<p>
							Order status: {order.status[0].toUpperCase() + order.status.slice(1)}
						</p>
						<p>
							Order complete? {order.complete ? 'Yes' : 'No'}
						</p>
						{#if order.status === 'delivered' && order.delivered}
							<p>Order delivered at: {new Date(order.delivered).toLocaleString('nl-BE')}</p>
						{/if}
					</div>
					<div>
						<a href={`/order/${order.id}`} class="ml-auto bg-blue-400 px-4 py-2"> View Order </a>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:catch error}
	<p class="bg-red-400">Error loading orders: {error}</p>
{/await}
