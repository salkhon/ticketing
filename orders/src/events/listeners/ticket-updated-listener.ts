import {
	Listener,
	Subject,
	TicketUpdatedEvent,
} from "@salkhon-ticketing/common";
import { orderServiceTicketUpdated } from "./durable-name";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedLister extends Listener<TicketUpdatedEvent> {
	readonly subject = Subject.TicketUpdated;
	readonly durableName = orderServiceTicketUpdated;

	async onMessage(data: TicketUpdatedEvent["data"], message: JsMsg) {
		const { id, version, title, price } = data;
		const ticket = await Ticket.findByEvent({ id, version });

		if (!ticket) {
			throw new Error("Ticket not found");
		}

		ticket.set({
			title,
			price,
		});
		await ticket.save();

		message.ack();
	}
}
