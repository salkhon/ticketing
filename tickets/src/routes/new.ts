import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@salkhon-ticketing/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
	"/api/tickets",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be greater than 0"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;
		const ticket = new Ticket({
			title,
			price,
			userId: req.currentUser!.id,
		});
		await ticket.save();
    
		// while publishing an event, use the data from the model - not the request body
		// this is because the model may have sanitized the data via a mongoose pre-save hook

		res.status(201).send(ticket);
	}
);

export { router as createTicketRouter };
