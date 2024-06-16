import {
	Listener,
	Subject,
	TicketCreatedEvent,
} from "@salkhon-ticketing/common";
import { JsMsg } from "nats";
import { orderServiceTicketCreated } from "./durable-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subject.TicketCreated;
	readonly durableName = orderServiceTicketCreated;

	async onMessage(data: TicketCreatedEvent["data"], message: JsMsg) {
		const { id, title, price } = data;
		const ticket = new Ticket({
			_id: id, // same id as the ticket service
			title,
			price,
		});
		console.log(ticket);
		await ticket.save();

		message.ack();
	}
}
