import { z } from 'zod';

export const orderStatusEnum = ['placed', 'approved', 'delivered'] as const;

export const orderSchema = z.object({
	id: z.string(),
	pets: z.array(z.string()),
	delivered: z.string().optional(),
	status: z.enum(orderStatusEnum).default('placed'),
	complete: z.boolean().default(false),
	user: z.string(),
	created: z.string(),
	updated: z.string()
});

export const orderCreateSchema = orderSchema.omit({ id: true, created: true, updated: true });
export const orderUpdateSchema = orderCreateSchema.partial();
export const orderDeleteSchema = orderSchema.pick({ id: true });

export type OrderSchema = z.infer<typeof orderSchema>;
export type OrderCreateSchema = z.infer<typeof orderCreateSchema>;
export type OrderUpdateSchema = z.infer<typeof orderUpdateSchema>;
export type OrderDeleteSchema = z.infer<typeof orderDeleteSchema>;
