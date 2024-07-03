import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";

it("returns a 404 when purchasing an order that does not exist", async () => {
	await request(app)
		.get(`/api/payments/${new mongoose.Types.ObjectId().toHexString()}`) // does not exist
		.set("Cookie", signin())
		.send()
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
		.get(`/api/payments/${order.id}`)
		.set("Cookie", signin())
		.send()
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
		.get(`/api/payments/${order.id}`)
		.set("Cookie", signin(userId))
		.send()
		.expect(400);
});
