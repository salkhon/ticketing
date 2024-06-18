import { TicketCreatedEvent } from "@salkhon-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { Ticket } from "../../../models/ticket";

async function setup() {
	// create listener
	const listener = new TicketCreatedListener(natsWrapper.connection);

	// create fake data event
	const data: TicketCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		title: "concert",
		price: 20,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// create fake message object
	// @ts-ignore
	const msg: JsMsg = {
		ack: jest.fn(),
	};

	return {
		listener,
		data,
		msg,
	};
}

it("creates and saves a ticket", async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const ticket = await Ticket.findById(data.id);
	expect(ticket).toBeDefined();
	expect(ticket?.title).toEqual(data.title);
	expect(ticket?.price).toEqual(data.price);
});

it("acks the message", async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
