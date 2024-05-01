import {
	Publisher,
	Subject,
	TicketCreatedEvent,
} from "@salkhon-ticketing/common";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subject.TicketCreated;
}
