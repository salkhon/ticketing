import {
	PaymentCreatedEvent,
	Publisher,
	Subject,
} from "@salkhon-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subject.PaymentCreated;
}
