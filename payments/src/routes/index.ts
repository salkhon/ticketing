import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from "@salkhon-ticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { stripe } from "../stripe";

const router = express.Router();

router.get(
	"/api/payments/:orderId",
	requireAuth,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;
		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser?.id) {
			throw new NotAuthorizedError();
		}
		if (order.status === OrderStatus.CANCELLED) {
			throw new BadRequestError("Cannot pay for a cancelled order");
		}
		if (!order.paymentIntentId) {
			throw new BadRequestError("Payment intent not found");
		}

		const paymentIntent = await stripe.paymentIntents.retrieve(
			order.paymentIntentId
		);

		res.send({
			clientSecret: paymentIntent.client_secret,
		});
	}
);

export { router as getClientSecretRouter };
