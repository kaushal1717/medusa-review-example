// src/api/store/reviews/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createReviewWorkflow } from "src/workflows/create-reviews";
import { CreateReviewType } from "./validators";
import { MedusaError } from "@medusajs/framework/utils";

export async function POST(
  req: MedusaRequest<CreateReviewType>,
  res: MedusaResponse
) {
  const { review, customerId, productId, stars, isValidated } =
    req.validatedBody;

  try {
    const { result } = await createReviewWorkflow(req.scope).run({
      input: {
        review,
        customerId,
        productId,
        stars,
        isValidated,
      },
    });

    res.json({
      review: result,
    });
  } catch (error) {
    if (
      error instanceof MedusaError &&
      error.type === MedusaError.Types.NOT_FOUND
    ) {
      res.status(404).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "An unexpected error occurred",
      });
    }
  }
}
