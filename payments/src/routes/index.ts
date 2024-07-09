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
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const STRIPE_PAYMENT_SUCCESS_EVENT = "payment_intent.succeeded";

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

router.post("/api/payments/webhook", async (req: Request, res: Response) => {
  const event = req.body;

	if (event.type === STRIPE_PAYMENT_SUCCESS_EVENT) {
		const paymentIntentId: string = event.paymentIntentId;

		const order = await Order.findOne({ paymentIntentId });
		if (!order) {
			throw new NotFoundError();
		}

		order.set({ status: OrderStatus.COMPLETED });
		await order.save();

		await new PaymentCreatedPublisher(natsWrapper.connection).publish({
			id: paymentIntentId,
			orderId: order.id,
		});
	}

	// Return a 200 response to acknowledge receipt of the event
	res.json({ received: true });
});

export { router as paymentRouter };
