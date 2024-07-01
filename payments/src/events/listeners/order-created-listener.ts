import {
	Listener,
	OrderCreatedEvent,
	Subject,
} from "@salkhon-ticketing/common";
import { orderCreatedDurableName } from "./durable-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subject.OrderCreated;
	readonly durableName = orderCreatedDurableName;

	async onMessage(data: OrderCreatedEvent["data"], message: JsMsg) {
		const order = new Order({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version,
		});
		await order.save();

		message.ack();
	}
}
