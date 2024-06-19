import { OrderCancelledEvent } from "@salkhon-ticketing/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { OrderCancelledListener } from "../order-cancelled-listener";

async function setup() {
	// create listener
	const listener = new OrderCancelledListener(natsWrapper.connection);

	// create a ticket
	const ticket = new Ticket({
		title: "concert",
		price: 20,
		userId: "123",
		orderId: new mongoose.Types.ObjectId().toHexString(),
	});
	await ticket.save();

	// create event data
	const eventData: OrderCancelledEvent["data"] = {
		id: ticket.orderId!,
		version: 1,
		ticket: {
			id: ticket.id,
		},
	};

	// create a message
	// @ts-ignore
	const message: JsMsg = {
		ack: jest.fn(),
	};

	return { listener, ticket, eventData, message };
}

it("updates the ticket", async () => {
	const { listener, ticket, eventData, message } = await setup();

	await listener.onMessage(eventData, message);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket?.orderId).not.toBeDefined();
});

it("acks the message", async () => {
	const { listener, eventData, message } = await setup();

	await listener.onMessage(eventData, message);

	expect(message.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
	const { listener, ticket, eventData, message } = await setup();

	await listener.onMessage(eventData, message);

	expect(natsWrapper.connection.jetstream).toHaveBeenCalled();
});
