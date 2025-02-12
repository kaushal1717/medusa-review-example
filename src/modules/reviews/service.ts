import { MedusaService } from "@medusajs/framework/utils";
import Review from "./models/review";

class ReviewService extends MedusaService({
  Review,
}) { }

export default ReviewService
