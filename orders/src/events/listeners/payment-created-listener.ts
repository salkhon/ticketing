import {
	Listener,
	OrderStatus,
	PaymentCreatedEvent,
	Subject,
} from "@salkhon-ticketing/common";
import { JsMsg } from "nats";
import { orderServicePaymentCreated } from "./durable-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subject.PaymentCreated;
	readonly durableName = orderServicePaymentCreated;

	async onMessage(data: PaymentCreatedEvent["data"], message: JsMsg) {
		const { orderId } = data;
		const order = await Order.findById(orderId);

		if (!order) {
			throw new Error("Order not found");
		}

		if (
			order.status === OrderStatus.COMPLETED ||
			order.status === OrderStatus.CANCELLED
		) {
			throw new Error("Order already completed or cancelled");
		}

		order.set({
			status: OrderStatus.COMPLETED,
		});
		await order.save();

		// todo: publish an event that the order has been updated (changed version)
		// however, after the order is completed, we no longer need any more updates - so versioning is not necessary

		message.ack();
	}
}
