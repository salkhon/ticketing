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

const EXPIRATION_WINDOW_SECONDS = 15; // should be (env variable/in admin DB) to avoid deploying on every change

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
		expiration.setSeconds(
			expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS * 60
		);

		// save order
		const order = new Order({
			userId: req.currentUser!.id,
			status: OrderStatus.CREATED,
			expiresAt: expiration,
			ticket,
		});
		await order.save();

		// todo: publish order creation event
		res.status(201).send(order);
	}
);

export { router as newOrderRouter };
