import express from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@salkhon-ticketing/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req, res) => {
	const ticket = await Ticket.findById(req.params.id);

	if (!ticket) {
		throw new NotFoundError();
	}

	res.send(ticket); // status code defaults to 200
});

export { router as showTicketRouter };
