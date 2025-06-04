import { z } from 'zod';

export const petStatusEnum = ['available', 'pending', 'sold'] as const;

export const petSchema = z.object({
	id: z.string(),
	name: z.string(),
	photos: z.array(z.string()).optional(),
	status: z.enum(petStatusEnum).default('available'),
	category: z.string().optional(),
	created: z.string(),
	updated: z.string()
});

export const petCreateSchema = petSchema.omit({ id: true, created: true, updated: true });
export const petUpdateSchema = petCreateSchema.partial();
export const petDeleteSchema = petSchema.pick({ id: true });

export type PetSchema = z.infer<typeof petSchema>;
export type PetCreateSchema = z.infer<typeof petCreateSchema>;
export type PetUpdateSchema = z.infer<typeof petUpdateSchema>;
export type PetDeleteSchema = z.infer<typeof petDeleteSchema>;
