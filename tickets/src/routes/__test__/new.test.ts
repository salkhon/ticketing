import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for POST requests", async () => {
	const response = await request(app).post("/api/tickets").send({});

	expect(response.status).not.toEqual(404);
});

it("returns an error if user not signed in for protected route", async () => {
	// we're not authenticated
	await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
	const cookie = signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({});

	expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
	const cookie = signin();
	await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 10,
		})
		.expect(400);

	await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			price: 10,
		})
		.expect(400);
});

it("returns an error if an invalid price is provided", async () => {
	const cookie = signin();
	await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "title",
			price: -10,
		})
		.expect(400);

	await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "title",
		})
		.expect(400);
});

it("creates a ticket with valid inputs", async () => {
	const cookie = signin();

	expect(await Ticket.countDocuments({})).toEqual(0);

	const ticket = {
		title: "title",
		price: 20,
	};
	await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send(ticket)
		.expect(201);

	const tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].title).toEqual(ticket.title);
	expect(tickets[0].price).toEqual(ticket.price);
});
