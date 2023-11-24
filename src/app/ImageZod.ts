import { z } from "zod";

export const ImageSchema = z.object({
  url: z.string(),
  description: z.string(),
  slideActive: z.boolean().optional(),
  groupId: z.number().int().positive(),
});

export type ImageSchemaT = z.infer<typeof ImageSchema>