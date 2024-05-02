import {
	Publisher,
	Subject,
	TicketCreatedEvent,
} from "@salkhon-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subject.TicketCreated;
}
