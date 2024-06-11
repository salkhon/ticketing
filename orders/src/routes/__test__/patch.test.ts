import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@salkhon-ticketing/common";
import { Order } from "../../models/order";

// todo: test auth, params, order not found, not authorized, valid input

it("marks an order as cancelled", async () => {
	const cookie = signin();

	// create a ticket
	const ticket = new Ticket({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	// order the ticket
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({ ticketId: ticket.id })
		.expect(201);

	// cancel the order
	await request(app)
		.patch(`/api/orders/${order.id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	// get the order
	const updatedOrder = await Order.findById(order.id);

	// ensure cancel status
	expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
});

it.todo("emits an order cancelled event");
