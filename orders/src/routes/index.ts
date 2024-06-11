import { requireAuth } from "@salkhon-ticketing/common";
import express from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req, res) => {
	const orders = await Order.find({ userId: req.currentUser!.id }).populate(
		"ticket"
	); // mongoose ref
	res.send(orders);
});

export { router as indexOrderRouter };
