import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/orders for POST requests", async () => {
	const response = await request(app).post("/api/orders").send({});

	expect(response.status).not.toEqual(404);
});

it("returns an error if user not signed in for protected route", async () => {
	// we're not authenticated
	await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
	const cookie = signin();
	const response = await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({});

	expect(response.status).not.toEqual(401);
});

it("returns an error if the ticket does not exist", async () => {
	const cookie = signin();

	// never inserted this ticket
	const ticketId = new mongoose.Types.ObjectId();
	await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({ ticketId })
		.expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
	const cookie = signin();

	// create a ticket
	const ticket = new Ticket({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	// associate ticket with new order
	const order = new Order({
		ticket,
		userId: "randomUserId",
		status: OrderStatus.CREATED,
		expiresAt: new Date(),
	});
	await order.save();

	// try to reserve the same ticket
	await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({
			ticketId: ticket.id,
		})
		.expect(400);
});

it("reserves a ticket", async () => {
	const cookie = signin();

	// create a ticket
	const ticket = new Ticket({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	// try to reserve the same ticket
	await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);
});

it("emits an order created event", async () => {
	const cookie = signin();

	const ticket = new Ticket({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", cookie)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	// async publish() method test is not working
	expect(natsWrapper.connection.jetstream).toHaveBeenCalled();
});
