<script lang="ts">
	import '../app.css';
	import AuthState from '$lib/components/auth.state.svelte';
	import CartState from '$lib/components/cart.state.svelte';
	import Navigation from '$lib/components/navigation.svelte';

	let { children } = $props();
</script>

<AuthState>
	<CartState>
		<div class="container mx-auto p-4">
			<Navigation />
			{@render children()}
		</div>
	</CartState>
</AuthState>
