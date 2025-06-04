<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAuthStore } from '$lib/stores/auth.store.svelte';

	const authStore = getAuthStore();

	$effect(() => {
		authStore.logout();
		goto('/');
	});
</script>
