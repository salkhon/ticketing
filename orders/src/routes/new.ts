import { requireAuth, validateRequest } from "@salkhon-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

router.post(
	"/api/orders",
	requireAuth,
	[body("ticketId").not().isEmpty().withMessage("TicketId is required")],
	async (req: Request, res: Response) => {
		res.send({ message: "New Orders route" });
	}
);

export { router as newOrderRouter };
