import {
	ExpirationCompleteEvent,
	Listener,
	OrderStatus,
	Subject,
} from "@salkhon-ticketing/common";
import { orderServiceExpirationComplete } from "./durable-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subject.ExpirationComplete;
	readonly durableName = orderServiceExpirationComplete;

	async onMessage(data: ExpirationCompleteEvent["data"], msg: JsMsg) {
		const order = await Order.findById(data.orderId).populate("ticket");
		if (!order) {
			throw new Error("Order not found");
		}

		if (
			order.status === OrderStatus.CREATED ||
			order.status === OrderStatus.AWAITING_PAYMENT
		) {
			order.set({
				status: OrderStatus.CANCELLED,
			});
			await order.save();

			await new OrderCancelledPublisher(this.nc).publish({
				id: order.id,
				version: order.version,
				ticket: {
					id: order.ticket.id.toString(),
				},
			});
		} else {
      console.log(`Order status is ${order.status}, ignoring expiration`);
    }

		msg.ack();
	}
}
