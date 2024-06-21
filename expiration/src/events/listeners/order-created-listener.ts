import {
	Listener,
	OrderCreatedEvent,
	Subject,
} from "@salkhon-ticketing/common";
import { orderCreatedDurableName } from "./durable-name";
import { JsMsg } from "nats";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subject.OrderCreated;
	readonly durableName = orderCreatedDurableName;

	async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
		await expirationQueue.add({
			orderId: data.id,
		});

    msg.ack();
	}
}
