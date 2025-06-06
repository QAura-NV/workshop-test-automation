<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.store.svelte';
	import { getCartStore } from '$lib/stores/cart.store.svelte';

	const authStore = getAuthStore();
	const cartStore = getCartStore();

	const name = $derived.by(() => (authStore.admin ? `${authStore.name} (Admin)` : authStore.name));
</script>

<nav class="mb-4 flex flex-col gap-4 md:flex-row md:justify-between">
	<ul class="flex gap-4">
		<li class="bg-blue-400 px-4 py-2"><a href="/pets">Pets</a></li>
	</ul>
	<div class="flex justify-between gap-4">
		{#if !authStore.isValid}
			<div class="bg-blue-400 px-4 py-2"><a href="/auth/login">Login</a></div>
		{/if}
		{#if authStore.isValid}
			<div class="bg-green-400 px-4 py-2">{name}</div>
			<div class="bg-blue-400 px-4 py-2"><a href="/auth/logout">Logout</a></div>
		{/if}
		{#if authStore.isValid}
			<div class="bg-blue-400 px-4 py-2"><a href="/orders">My Orders</a></div>
		{/if}
		<div class="bg-blue-400 px-4 py-2">
			<a href="/order/cart">Cart ({cartStore.cart.length})</a>
		</div>
	</div>
</nav>
