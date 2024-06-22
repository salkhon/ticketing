import {
	ExpirationCompleteEvent,
	Publisher,
	Subject,
} from "@salkhon-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subject.ExpirationComplete;
}
