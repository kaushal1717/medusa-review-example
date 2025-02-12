import ProductModule from "@medusajs/medusa/product";
import ReviewModule from "../modules/reviews";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  {
    linkable: ReviewModule.linkable.review,
    isList: true,
  },
  ProductModule.linkable.product
);
