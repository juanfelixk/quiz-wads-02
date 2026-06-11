import { z } from "zod";

/** EXAM Q3: title min length too weak — students should use .min(1) */
export const createTodoSchema = z.object({
  title: z.string().max(200).min(1),
  description: z.string().max(2000).optional(),
  completed: z.boolean().optional().default(false),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  completed: z.boolean().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});
