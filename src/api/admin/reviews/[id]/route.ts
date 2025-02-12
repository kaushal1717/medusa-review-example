// src/api/admin/reviews/[id]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { validateReviewWorkflow } from "src/workflows/validate-reviews";
import { z } from "zod";
import { MedusaError } from "@medusajs/framework/utils";

export const validateReviewSchema = z.object({
  isValidated: z.boolean(),
});

type validateReviewType = z.infer<typeof validateReviewSchema>;

export async function PATCH(
  req: MedusaRequest<validateReviewType>,
  res: MedusaResponse
) {
  const { id } = req.params;
  const { isValidated } = req.validatedBody;

  console.log("review ID from params: ", id);
  try {
    console.log("Review ID input for workflow from route.ts: ", id);
    const { result } = await validateReviewWorkflow(req.scope).run({
      input: {
        id,
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
        error: error.message,
      });
    }
  }
}
