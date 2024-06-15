import {
	Listener,
	Subject,
	TicketCreatedEvent,
} from "@salkhon-ticketing/common";
import { JsMsg } from "nats";
import { orderServiceDurableName } from "./durable-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subject.TicketCreated;
	readonly durableName = orderServiceDurableName;

	async onMessage(data: TicketCreatedEvent["data"], message: JsMsg) {
		const { id, title, price } = data;
		const ticket = new Ticket({
			id,
			title,
			price,
		});
		// todo: check if _id and id are the same
		console.log("ticket", ticket, ticket.id, ticket._id);
		await ticket.save();

		message.ack();
	}
}
