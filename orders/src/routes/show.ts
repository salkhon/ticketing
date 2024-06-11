import { NotAuthorizedError, NotFoundError, requireAuth } from "@salkhon-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.get(
	"/api/orders/:orderId",
	requireAuth,
	[
		body("orderId")
			.not()
			.isEmpty()
			.withMessage("OrderId is required")
			.isMongoId()
			.withMessage("OrderId must be valid"),
	],
	async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

		res.send(order);
	}
);

export { router as showOrderRouter };
