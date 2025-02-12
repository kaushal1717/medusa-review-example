// src/workflows/get-all-reviews.ts
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

// Define explicit types for our review and metadata
type Review = {
  id: string;
  review: string;
  stars: number;
  isValidated: boolean;
  product: {
    id: string;
    title: string;
    // Add other product fields as needed
  };
  customer: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

type Metadata = {
  count: number;
  take: number;
  skip: number;
};

type GetAllReviewsInput = {
  limit?: number;
  offset?: number;
};

type GetAllReviewsResult = {
  reviews: Review[];
  metadata: Metadata;
};

const getAllReviewsStep = createStep(
  "get-all-reviews",
  async ({ limit = 20, offset = 0 }: GetAllReviewsInput, { container }) => {
    const query = container.resolve("query");

    const { data: reviews, metadata } = await query.graph({
      entity: "review",
      fields: [
        "*",
        "product.*",
        "customer.id",
        "customer.email",
        "customer.first_name",
        "customer.last_name",
      ],
      pagination: {
        skip: offset,
        take: limit,
      },
    });

    const result: GetAllReviewsResult = {
      reviews: reviews as Review[],
      metadata: metadata as Metadata,
    };

    return new StepResponse(result, result);
  }
);

export const getAllReviewsWorkflow = createWorkflow(
  "get-all-reviews",
  (input: GetAllReviewsInput) => {
    const reviews = getAllReviewsStep(input);
    return new WorkflowResponse(reviews);
  }
);
