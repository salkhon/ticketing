import {
	Listener,
	OrderCreatedEvent,
	Subject,
} from "@salkhon-ticketing/common";
import { orderCreatedDurableName } from "./durable-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subject.OrderCreated;
	readonly durableName = orderCreatedDurableName;

	async onMessage(data: OrderCreatedEvent["data"], message: JsMsg) {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: data.ticket.price * 100, // in cents
			currency: "usd",
			metadata: {
				orderId: data.id,
			},
		});

		const order = new Order({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version,
			paymentIntentId: paymentIntent.id,
		});
		await order.save();

		message.ack();
	}
}
