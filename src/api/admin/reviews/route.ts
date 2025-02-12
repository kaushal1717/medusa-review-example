// src/api/admin/reviews/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getAllReviewsWorkflow } from "../../../workflows/get-all-reviews";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const { result } = await getAllReviewsWorkflow(req.scope).run({
      input: { limit, offset },
    });

    res.json({
      reviews: result.reviews,
      count: result.metadata.count,
      limit: result.metadata.take,
      offset: result.metadata.skip,
    });
  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
}
