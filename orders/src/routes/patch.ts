import {
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from "@salkhon-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.patch(
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

		order.status = OrderStatus.CANCELLED;
		await order.save();

		new OrderCancelledPublisher(natsWrapper.connection).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id.toString(),
			},
		});

		res.status(200).send(order);
	}
);

export { router as patchOrderRouter };
