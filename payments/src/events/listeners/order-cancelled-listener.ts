import {
	Listener,
	OrderCancelledEvent,
	OrderStatus,
	Subject,
} from "@salkhon-ticketing/common";
import { orderCancelledDurableName } from "./durable-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subject.OrderCancelled;
	readonly durableName = orderCancelledDurableName;

	async onMessage(data: OrderCancelledEvent["data"], message: JsMsg) {
		const order = await Order.findByEvent(data);

		if (!order) {
			throw new Error("Order not found");
		}

		if (
			order.status === OrderStatus.CREATED ||
			order.status === OrderStatus.AWAITING_PAYMENT
		) {
			await stripe.paymentIntents.cancel(order.paymentIntentId);
			order.set({ status: OrderStatus.CANCELLED });
			await order.save();
		}

		message.ack();
	}
}
