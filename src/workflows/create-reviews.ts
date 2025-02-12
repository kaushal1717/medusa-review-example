// src/workflows/create-review.ts
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { REVIEW_MODULE } from "src/modules/reviews";
import ReviewService from "src/modules/reviews/service";
import { Modules } from "@medusajs/framework/utils";
import { MedusaError } from "@medusajs/framework/utils";

type CreateReviewInput = {
  review: string;
  customerId: string;
  productId: string;
  stars: number;
  isValidated: boolean;
};

const createReviewStep = createStep(
  "create-review",
  async (input: CreateReviewInput, { container }) => {
    const reviewModuleService: ReviewService = container.resolve(REVIEW_MODULE);
    const link = container.resolve("link");
    const query = container.resolve("query");

    // Validate customer existence
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id"],
      filters: {
        id: input.customerId,
      },
    });

    if (customers.length === 0) {
      console.log("Customer is not existing");
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer with id ${input.customerId} not found`
      );
    }

    // Validate product existence
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: {
        id: input.productId,
      },
    });

    if (products.length === 0) {
      console.log("Product is not existing");
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with id ${input.productId} not found`
      );
    }

    const review = await reviewModuleService.createReviews({
      review: input.review,
      stars: input.stars,
      isValidated: input.isValidated,
    });

    // Create links
    await link.create([
      {
        [REVIEW_MODULE]: {
          review_id: review.id,
        },
        [Modules.PRODUCT]: {
          product_id: input.productId,
        },
      },
      {
        [REVIEW_MODULE]: {
          review_id: review.id,
        },
        [Modules.CUSTOMER]: {
          customer_id: input.customerId,
        },
      },
    ]);

    return new StepResponse(review, review);
  }
);

export const createReviewWorkflow = createWorkflow(
  "create-review",
  (input: CreateReviewInput) => {
    const review = createReviewStep(input);
    return new WorkflowResponse(review);
  }
);
