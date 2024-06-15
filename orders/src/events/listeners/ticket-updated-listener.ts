import {
	Listener,
	Subject,
	TicketUpdatedEvent,
} from "@salkhon-ticketing/common";
import { orderServiceDurableName } from "./durable-name";
import { JsMsg } from "nats";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedLister extends Listener<TicketUpdatedEvent> {
	readonly subject = Subject.TicketUpdated;
	readonly durableName = orderServiceDurableName;

	async onMessage(data: TicketUpdatedEvent["data"], message: JsMsg) {
		const ticket = await Ticket.findById(data.id);
		if (!ticket) {
			throw new Error("Ticket not found");
		}
    
		const { title, price } = data;
		ticket.set({
			title,
			price,
		});
		await ticket.save();

		message.ack();
	}
}
