import request from "supertest";
import { app } from "../../app";
import { generateId, signin } from "../../test/setup";

it("returns a 404 if the provided id does not exist", async () => {
	await request(app)
		.put(`/api/tickets/${generateId()}`)
		.set("Cookie", signin())
		.send({
			title: "title",
			price: 20,
		})
		.expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
	await request(app)
		.put(`/api/tickets/${generateId()}`)
		.send({
			title: "title",
			price: 20,
		})
		.expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
	const cookie1 = signin();
	const ticket = { title: "title", price: 20 };
	let response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie1)
		.send(ticket);

	const cookie2 = signin(); // different user with random id
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie2)
		.send({ title: "new title", price: 100 })
		.expect(401);

	// verify that the ticket was not updated
	response = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(response.body.title).toEqual(ticket.title);
	expect(response.body.price).toEqual(ticket.price);
});

it("returns a 400 if the user provides invalid title or price", async () => {
	const cookie = signin();
	const ticket = { title: "title", price: 20 };
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send(ticket);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "title",
			price: -10,
		})
		.expect(400);
});

it("updates the ticket provided valid inputs", async () => {
	const cookie = signin();
	const ticket = { title: "title", price: 20 };
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send(ticket);

	const newTicket = { title: "new title", price: 100 };
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send(newTicket)
		.expect(200);

	const updatedTicket = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();
	expect(updatedTicket.body.title).toEqual(newTicket.title);
	expect(updatedTicket.body.price).toEqual(newTicket.price);
});
