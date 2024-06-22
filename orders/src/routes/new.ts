import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from "@salkhon-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const EXPIRATION_WINDOW_MINS = 1; // should be (env variable/in admin DB) to avoid deploying on every change

const router = express.Router();

router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.not()
			.isEmpty()
			.withMessage("TicketId is required")
			.isMongoId()
			.withMessage("TicketId must be valid"),
	],
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		// find the ordered ticket
		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}

		// ensure ticket is not reserved
		const isReserved = await ticket.isReserved();
		if (isReserved) {
			throw new BadRequestError("Ticket is already reserved");
		}

		// calculate expiration date
		const expiration = new Date();
		expiration.setMinutes(expiration.getMinutes() + EXPIRATION_WINDOW_MINS);

		// save order
		const order = new Order({
			userId: req.currentUser!.id,
			status: OrderStatus.CREATED,
			expiresAt: expiration,
			ticket,
		});
		await order.save();

		// publish order creation event
		await new OrderCreatedPublisher(natsWrapper.connection).publish({
			id: order.id,
			version: order.version,
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt.toISOString(),
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
		});

		res.status(201).send(order);
	}
);

export { router as newOrderRouter };
