import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../models/ticket";

// todo: write parameter, authorization tests for /api/orders/:orderId

it("fetches the order", async () => {
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

	// fetch the order
	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
	const cookie1 = signin();
	const cookie2 = signin();

	// create a ticket
	const ticket = new Ticket({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	// order the ticket
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", cookie1)
		.send({ ticketId: ticket.id })
		.expect(201);

	// fetch the order
	await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", cookie2)
		.send()
		.expect(401);
});
