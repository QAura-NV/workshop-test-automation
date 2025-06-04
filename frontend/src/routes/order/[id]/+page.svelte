<script lang="ts">
	import { getPocketBase } from '$lib/services/pocketbase';
	import pictureNotFound from '$lib/assets/picture-not-found.png';
	import type { PetSchema } from '$lib/schemas/pet.schema';
	import { page } from '$app/state';

	const orderId = $derived(page.params.id);

	const order = $derived(getPocketBase().collection('orders').getOne(orderId));

	const pets = $derived.by(async () => {
		return await getPocketBase()
			.collection('pets')
			.getFullList({
				sort: '-created',
				filter: (await order).pets.map((pet) => `id = '${pet}'`).join(' || ')
			});
	});

	const categories = getPocketBase().collection('categories').getFullList({
		sort: '-created'
	});

	const user = $derived.by(async () => {
		return getPocketBase()
			.collection('users')
			.getOne((await order).user);
	});

	const getPictureUrl = (record: PetSchema, asset: string) => {
		return getPocketBase().files.getURL(record, asset);
	};

	const changeOrderStatusToApproved = async () => {
		await getPocketBase().collection('orders').update(orderId, { status: 'approved' });
		alert('Order status changed to approved');
		window.location.reload();
	};

	const changeOrderStatusToDelivered = async () => {
		await getPocketBase()
			.collection('orders')
			.update(orderId, { status: 'delivered', delivered: new Date() });
		alert('Order status changed to delivered');
		window.location.reload();
	};

	const completeOrder = async () => {
		await getPocketBase().collection('orders').update(orderId, { complete: true });
		alert('Order marked as complete');
		window.location.reload();
	};
</script>

<div class="mb-4 flex items-center justify-between gap-4 bg-gray-100">
	<h1 class="px-4 py-2 text-xl">Order ({orderId})</h1>
</div>
{#await order}
	<p>Loading order...</p>
{:then order}
	{#await user}
		<p>Loading user...</p>
	{:then user}
		<div class="pb-4">
			<p>
				Order placed by: {user.name} ({user.email}) at {new Date(order.created).toLocaleString(
					'nl-BE'
				)}
			</p>
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
	{:catch error}
		<p class="bg-red-400">Error loading user: {error}</p>
	{/await}
	{#await pets}
		<p>Loading pets...</p>
	{:then pets}
		<div class="flex flex-col gap-4">
			{#each pets as pet}
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
			<div class="flex justify-end gap-4">
				<button
					class="cursor-pointer bg-blue-400 px-4 py-2"
					onclick={() => changeOrderStatusToApproved()}
				>
					Change order status to approved
				</button>
				<button
					class="cursor-pointer bg-blue-400 px-4 py-2"
					onclick={() => changeOrderStatusToDelivered()}
				>
					Change order status to delivered
				</button>
				<button class="cursor-pointer bg-blue-400 px-4 py-2" onclick={() => completeOrder()}>
					Mark order as complete
				</button>
			</div>
		</div>
	{:catch error}
		<p class="bg-red-400">Error loading pets: {error}</p>
	{/await}
{:catch error}
	<p class="bg-red-400">Error loading order: {error}</p>
{/await}
