import { TicketUpdatedEvent } from "@salkhon-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedLister } from "../ticket-updated-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

async function setup() {
	// create listener
	const listener = new TicketUpdatedLister(natsWrapper.connection);

	// create fake data ticket
	const ticket = new Ticket({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();

	// create fake data event
	const data: TicketUpdatedEvent["data"] = {
		id: ticket.id,
		version: ticket.version + 1, // edited once
		title: "new title",
		price: 69,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// create fake message object
	// @ts-ignore
	const msg: JsMsg = {
		ack: jest.fn(),
	};

	return {
		listener,
		ticket,
		data,
		msg,
	};
}

it("finds, updates, and saves a ticket", async () => {
	const { listener, ticket, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket?.title).toEqual(data.title);
	expect(updatedTicket?.price).toEqual(data.price);
	expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message", async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
