import { env } from '$env/dynamic/public';
import PocketBase, { LocalAuthStore, type RecordService } from 'pocketbase';
import type { PetSchema } from '$lib/schemas/pet.schema';
import type { UserSchema } from '$lib/schemas/user.schema';
import type { CategorySchema } from '$lib/schemas/category.schema';
import type { OrderSchema } from '$lib/schemas/order.schema';

export interface TypedPocketBase extends PocketBase {
	collection(idOrName: string): RecordService; // default fallback for any other collection
	collection(idOrName: 'pets'): RecordService<PetSchema>;
	collection(idOrName: 'categories'): RecordService<CategorySchema>;
	collection(idOrName: 'orders'): RecordService<OrderSchema>;
	collection(idOrName: 'users'): RecordService<UserSchema>;
}

const authStore = new LocalAuthStore();
const pocketBase = new PocketBase(env.PUBLIC_POCKETBASE_URL, authStore) as TypedPocketBase;
pocketBase.autoCancellation(false); // Disable auto cancellation for all requests

export const getPocketBase = () => pocketBase;
