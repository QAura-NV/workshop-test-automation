import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string(),
	avatar: z.string().optional(),
	admin: z.boolean().default(false),
	created: z.string(),
	updated: z.string()
});

export const userCreateSchema = userSchema.omit({ id: true, created: true, updated: true });
export const userUpdateSchema = userCreateSchema.partial();
export const userDeleteSchema = userSchema.pick({ id: true });

export type UserSchema = z.infer<typeof userSchema>;
export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type UserDeleteSchema = z.infer<typeof userDeleteSchema>;
