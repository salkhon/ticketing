import {
	Publisher,
	Subject,
	OrderCreatedEvent,
} from "@salkhon-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subject.OrderCreated;
}
