import {
	Publisher,
	Subject,
	TicketUpdatedEvent,
} from "@salkhon-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subject.TicketUpdated;
}
