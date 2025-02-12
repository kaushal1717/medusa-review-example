import { CreateReviewSchema } from "./store/reviews/validators";
import { validateReviewSchema } from "./admin/reviews/[id]/route";
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/reviews",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateReviewSchema)],
    },
    {
      matcher: "/admin/reviews/:id",
      method: "PATCH",
      middlewares: [validateAndTransformBody(validateReviewSchema)],
    },
  ],
});
