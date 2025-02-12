// src/api/store/reviews/validators.ts
import { z } from "zod";

export const CreateReviewSchema = z.object({
  review: z.string(),
  customerId: z.string(),
  productId: z.string(),
  stars: z.number().int().min(1).max(5),
  isValidated: z.boolean().optional().default(false),
});

export type CreateReviewType = z.infer<typeof CreateReviewSchema>;
