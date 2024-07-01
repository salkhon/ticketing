import { OrderCancelledEvent, OrderStatus } from "@salkhon-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";

async function setup() {
	const listener = new OrderCancelledListener(natsWrapper.connection);

	const order = new Order({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.CREATED,
		userId: new mongoose.Types.ObjectId().toHexString(),
		price: 10,
	});
	await order.save();

	const cancelledOrderData: OrderCancelledEvent["data"] = {
		id: order.id,
		version: order.version + 1,
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
		},
	};

	// @ts-ignore
	const message: JsMsg = {
		ack: jest.fn(),
	};

	return { listener, order, cancelledOrderData, message };
}

it("updates the status of the order", async () => {
	const { listener, order, cancelledOrderData, message } = await setup();

	await listener.onMessage(cancelledOrderData, message);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder?.status).toEqual(OrderStatus.CANCELLED);
});

it("acks the message", async () => {
	const { listener, cancelledOrderData, message } = await setup();

	await listener.onMessage(cancelledOrderData, message);

	expect(message.ack).toHaveBeenCalled();
});
