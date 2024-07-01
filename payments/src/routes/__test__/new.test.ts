import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";

it("returns a 404 when purchasing an order that does not exist", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", signin())
		.send({
			token: "some token",
			orderId: new mongoose.Types.ObjectId().toHexString(), // does not exist
		})
		.expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
	const order = new Order({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: new mongoose.Types.ObjectId().toHexString(), // not the id of the signed in user
		version: 0,
		price: 20,
		status: OrderStatus.CREATED,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", signin())
		.send({
			token: "some token",
			orderId: order.id,
		})
		.expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = new Order({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: userId,
		version: 0,
		price: 20,
		status: OrderStatus.CANCELLED,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", signin(userId))
		.send({
			orderId: order.id,
			token: "some token",
		})
		.expect(400);
});
