import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@salkhon-ticketing/common";
import { JsMsg } from "nats";

async function setup() {
	const listener = new ExpirationCompleteListener(natsWrapper.connection);

	const ticket = new Ticket({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const order = new Order({
		status: OrderStatus.CREATED,
		userId: "123",
		expiresAt: new Date(),
		ticket,
	});
	await order.save();

	const eventData: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	};

	// @ts-ignore
	const msg: JsMsg = {
		ack: jest.fn(),
	};

	return { listener, order, ticket, eventData, msg };
}

it("updates the order status to cancelled", async () => {
	const { listener, order, eventData, msg } = await setup();
	await listener.onMessage(eventData, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder?.status).toEqual(OrderStatus.CANCELLED);
});

it("emits an OrderCancelled event", async () => {
	const { listener, order, eventData, msg } = await setup();
	await listener.onMessage(eventData, msg);

	expect(natsWrapper.connection.jetstream).toHaveBeenCalled();
});

it("acks the message", async () => {
	const { listener, eventData, msg } = await setup();
	await listener.onMessage(eventData, msg);

	expect(msg.ack).toHaveBeenCalled();
});
