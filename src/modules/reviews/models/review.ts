import { model } from "@medusajs/framework/utils";

const Review = model.define("review", {
  id: model.id().primaryKey(),
  review: model.text(),
  stars: model.number(),
  isValidated: model.boolean().default(false),
});

export default Review;
