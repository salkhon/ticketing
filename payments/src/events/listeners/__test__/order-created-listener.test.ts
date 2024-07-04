import { OrderCreatedEvent, OrderStatus } from "@salkhon-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { Order } from "../../../models/order";

function setup() {
	const listener = new OrderCreatedListener(natsWrapper.connection);

	const orderData: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.CREATED,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date().toISOString(),
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
			price: 10,
		},
	};

	// @ts-ignore
	const message: JsMsg = {
		ack: jest.fn(),
	};

	return { listener, orderData, message };
}

it("replicates the order info", async () => {
	const { listener, orderData, message } = setup();

	await listener.onMessage(orderData, message);

	const order = await Order.findById(orderData.id);

	expect(order).toBeDefined();
	expect(order?.price).toBe(orderData.ticket.price);
	expect(order?.status).toBe(orderData.status);
	expect(order?.userId).toBe(orderData.userId);
	expect(order?.version).toBe(orderData.version);
});

it("acks the message", async () => {
	const { listener, orderData, message } = setup();

	await listener.onMessage(orderData, message);

	expect(message.ack).toHaveBeenCalled();
});
