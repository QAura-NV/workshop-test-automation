import { getContext, setContext } from 'svelte';

export class CartStore {
	cart: string[] = $state([]);

	constructor() {
		this.loadFromLocalStorage();

		// Automatically save the cart to localStorage whenever it changes
		$effect(() => {
			this.saveToLocalStorage();
		});
	}

	addToCart(item: string) {
		if (this.isInCart(item)) return;
		this.cart.push(item);
	}

	removeFromCart(item: string) {
		if (!this.isInCart(item)) return;

		const index = this.cart.findIndex((cartItem) => cartItem === item);

		if (index !== -1) {
			this.cart.splice(index, 1);
		}
	}

	isInCart(item: string): boolean {
		return this.cart.some((cartItem) => cartItem === item);
	}

	clearCart() {
		this.cart = [];
	}

	saveToLocalStorage() {
		localStorage.setItem('cart', JSON.stringify(this.cart));
	}

	loadFromLocalStorage() {
		const cartData = localStorage.getItem('cart');
		if (cartData) {
			this.cart = JSON.parse(cartData);
		}
	}
}

const CART_STORE_KEY = Symbol('CART_STORE');

export const setCartStore = () => {
	return setContext(CART_STORE_KEY, new CartStore());
};

export const getCartStore = () => {
	return getContext<CartStore>(CART_STORE_KEY);
};
