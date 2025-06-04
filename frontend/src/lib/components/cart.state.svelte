<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setCartStore } from '$lib/stores/cart.store.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setCartStore();
</script>

{@render children()}
