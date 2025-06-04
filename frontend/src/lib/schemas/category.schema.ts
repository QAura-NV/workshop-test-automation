import { z } from 'zod';

export const categorySchema = z.object({
	id: z.string(),
	name: z.string(),
	created: z.string(),
	updated: z.string()
});

export const categoryCreateSchema = categorySchema.omit({ id: true, created: true, updated: true });
export const categoryUpdateSchema = categoryCreateSchema.partial();
export const categoryDeleteSchema = categorySchema.pick({ id: true });

export type CategorySchema = z.infer<typeof categorySchema>;
export type CategoryCreateSchema = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>;
export type CategoryDeleteSchema = z.infer<typeof categoryDeleteSchema>;
