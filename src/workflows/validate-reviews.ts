// src/workflows/update-review-validation.ts
import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { REVIEW_MODULE } from "src/modules/reviews";
import ReviewService from "src/modules/reviews/service";
import { MedusaError } from "@medusajs/framework/utils";

type UpdateReviewValidationInput = {
  id: string;
  isValidated: boolean;
};

const validateReviewStep = createStep(
  "update-review-validation",
  async (input: UpdateReviewValidationInput, { container }) => {
    const reviewModuleService: ReviewService = container.resolve(REVIEW_MODULE);
    const query = container.resolve("query");

    // Check if the review exists
    const { data: reviews } = await query.graph({
      entity: "review",
      fields: [
        "*",
        "product.id",
        "product.title",
        "product.handle",
        "customer.first_name",
        "customer.last_name",
        "customer.email",
      ],
      filters: {
        id: input.id,
      },
    });

    console.log("Input ID: ", input.id);

    console.log("retrieved review: ", reviews);

    if (reviews.length === 0) {
      console.log(`Review with id ${input.id} not found`);
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Review with id ${input.id} not found`
      );
    }

    const updatedReview = await reviewModuleService.updateReviews(input.id, {
      isValidated: input.isValidated,
    });

    return new StepResponse(updatedReview, updatedReview);
  }
);

export const validateReviewWorkflow = createWorkflow(
  "update-review-validation",
  (input: UpdateReviewValidationInput) => {
    const review = validateReviewStep(input);
    return new WorkflowResponse(review);
  }
);
