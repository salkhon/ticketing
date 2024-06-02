import request from "supertest";
import { app } from "../../app";
import { generateId, signin } from "../../test/setup";

it("returns a 4040 if the ticket is not found", async () => {
	await request(app).get(`/api/tickets/${generateId()}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
	const cookie = signin();
	const title = "concert";
	const price = 20;

	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title, price })
		.expect(201);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
