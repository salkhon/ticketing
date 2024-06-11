import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../models/ticket";

async function createTicket() {
	const ticket = new Ticket({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	return ticket;
}

it("has a route handler listening to /api/orders for GET requests", async () => {
	const response = await request(app).get("/api/orders").send();

	expect(response.status).not.toEqual(404);
});

it("returns an error if user not signed in for protected route", async () => {
	// we're not authenticated
	await request(app).get("/api/orders").send().expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
	const cookie = signin();
	const response = await request(app)
		.get("/api/orders")
		.set("Cookie", cookie)
		.send();

	expect(response.status).not.toEqual(401);
});

it("fetches orders for a particular user", async () => {
	// create 3 tickets
	const ticket1 = await createTicket();
	const ticket2 = await createTicket();
	const ticket3 = await createTicket();

	const user1Cookie = signin();
	const user2Cookie = signin();

	// create one order as user 1
	await request(app)
		.post("/api/orders")
		.set("Cookie", user1Cookie)
		.send({ ticketId: ticket1.id })
		.expect(201);

	// create two orders as user 2
	const { body: order1 } = await request(app)
		.post("/api/orders")
		.set("Cookie", user2Cookie)
		.send({ ticketId: ticket2.id })
		.expect(201);

	const { body: order2 } = await request(app)
		.post("/api/orders")
		.set("Cookie", user2Cookie)
		.send({ ticketId: ticket3.id })
		.expect(201);

	// make request to get orders for user 2
	const response = await request(app)
		.get("/api/orders")
		.set("Cookie", user2Cookie)
		.expect(200);

	// ensure we only get orders of user 2
	expect(response.body.length).toEqual(2);
	expect(response.body[0].id).toEqual(order1.id);
	expect(response.body[1].id).toEqual(order2.id);
	expect(response.body[0].ticket.id).toEqual(ticket2.id);
	expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
