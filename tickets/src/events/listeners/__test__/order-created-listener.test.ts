import { OrderCreatedEvent, OrderStatus } from "@salkhon-ticketing/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { JsMsg } from "nats";

async function setup() {
	// create listener
	const listener = new OrderCreatedListener(natsWrapper.connection);

	// create a ticket
	const ticket = new Ticket({
		title: "concert",
		price: 20,
		userId: "123",
	});
	await ticket.save();

	// create event data
	const eventData: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.CREATED,
		userId: "123",
		expiresAt: new Date().toISOString(),
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};

	// create a message
	// @ts-ignore
	const message: JsMsg = {
		ack: jest.fn(),
	};

	return { listener, ticket, eventData, message };
}

it("sets the userId of the ticket", async () => {
	const { listener, ticket, eventData, message } = await setup();

	await listener.onMessage(eventData, message);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(eventData.id);
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
