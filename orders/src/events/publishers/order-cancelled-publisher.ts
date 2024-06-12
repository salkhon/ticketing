import {
	Publisher,
	Subject,
	OrderCancelledEvent,
} from "@salkhon-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subject.OrderCancelled;
}
