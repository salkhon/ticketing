import {
	Listener,
	OrderCreatedEvent,
	Subject,
} from "@salkhon-ticketing/common";
import { orderCreatedDurableName } from "./durable-name";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subject.OrderCreated;
	readonly durableName = orderCreatedDurableName;

	async onMessage(data: OrderCreatedEvent["data"], message: JsMsg) {
		// find the ordered ticket
		const ticket = await Ticket.findById(data.ticket.id);
		if (!ticket) {
			throw new Error("Ticket not found");
		}

		// mark ticket reserved
		ticket.set({ orderId: data.id });
		await ticket.save();

		// publish ticket updated event (not using natsWrapper to avoid importing natsWrapper in this file)
		await new TicketUpdatedPublisher(this.nc).publish({
			id: ticket.id,
			version: ticket.version,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			orderId: ticket.orderId,
		});

		// ack the message
		message.ack();
	}
}
