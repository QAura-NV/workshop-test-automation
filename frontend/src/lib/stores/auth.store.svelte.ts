import type { UserSchema } from '$lib/schemas/user.schema';
import { getPocketBase, type TypedPocketBase } from '$lib/services/pocketbase';
import type { AuthRecord } from 'pocketbase';
import { getContext, setContext } from 'svelte';

export class AuthStore {
	isValid = $state(false);
	token = $state<string>('');
	id = $state<string>('');
	name = $state<string>('');
	avatarUrl = $state<string | null>(null);
	admin = $state(false);

	constructor(protected readonly pocketbase: TypedPocketBase = getPocketBase()) {
		this.token = pocketbase.authStore.token;
		this.isValid = pocketbase.authStore.isValid;
		this.updateUserFromAuthRecord(pocketbase.authStore.record);

		pocketbase.authStore.onChange((token, record) => {
			this.token = token;
			this.isValid = pocketbase.authStore.isValid;
			this.updateUserFromAuthRecord(record);
		});
	}

	protected updateUserFromAuthRecord(record: AuthRecord) {
		if (!record) return;

		const user = record as unknown as UserSchema;

		this.id = user.id;
		this.name = user.name;
		this.avatarUrl = user.avatar ? this.pocketbase.files.getURL(user, user.avatar) : null;
		this.admin = user.admin;
	}

	async authWithPassword(email: string, password: string) {
		return await this.pocketbase.collection('users').authWithPassword(email, password);
	}

	logout() {
		this.pocketbase.authStore.clear();
	}
}

const AUTH_STORE_KEY = Symbol('AUTH_STORE');

export const setAuthStore = () => {
	return setContext(AUTH_STORE_KEY, new AuthStore());
};

export const getAuthStore = () => {
	return getContext<ReturnType<typeof setAuthStore>>(AUTH_STORE_KEY);
};
