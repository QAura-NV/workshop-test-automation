<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAuthStore } from '$lib/stores/auth.store.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setAuthStore();
</script>

{@render children()}
