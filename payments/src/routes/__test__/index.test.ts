import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../stripe";

async function createOrder(userId: string, price: number, status: OrderStatus) {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: price * 100,
		currency: "usd",
		metadata: {
			orderId: new mongoose.Types.ObjectId().toHexString(),
		},
	});
	const order = new Order({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: userId,
		version: 0,
		price: price,
		status: status,
		paymentIntentId: paymentIntent.id,
	});
	return order;
}

it("returns a 404 when purchasing an order that does not exist", async () => {
	await request(app)
		.get(`/api/payments/${new mongoose.Types.ObjectId().toHexString()}`) // does not exist
		.set("Cookie", signin())
		.send()
		.expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
	const order = await createOrder(
		new mongoose.Types.ObjectId().toHexString(),
		20,
		OrderStatus.CREATED
	);
	await order.save();

	await request(app)
		.get(`/api/payments/${order.id}`)
		.set("Cookie", signin())
		.send()
		.expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = await createOrder(userId, 20, OrderStatus.CANCELLED);
	await order.save();

	await request(app)
		.get(`/api/payments/${order.id}`)
		.set("Cookie", signin(userId))
		.send()
		.expect(400);
});

it("returns Payment Intent Client Secret when purchasing an order", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = await createOrder(userId, 20, OrderStatus.CREATED);
	await order.save();

	const response = await request(app)
		.get(`/api/payments/${order.id}`)
		.set("Cookie", signin(userId))
		.send()
		.expect(200);

	expect(response.body.clientSecret).toBeDefined();
	expect(response.body.clientSecret).toEqual("mocked_client_secret");
});
