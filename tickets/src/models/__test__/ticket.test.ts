import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
	// create a ticket
	const ticket = new Ticket({
		title: "concert",
		price: 5,
		userId: "123",
	});

	// save ticket
	await ticket.save(); // update-if-current assigns version 0

	// fetch the ticket twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	// make two separate changes to the two instances
	firstInstance?.set({ price: 10 });
	secondInstance?.set({ price: 15 });

	// save the first fetched ticket
	await firstInstance?.save(); // update-if-current assigns version 1

	// save the second fetched ticket (will have an outdated version number)
	try {
		await secondInstance?.save();
	} catch (err) {
		// passes
		return;
	}
	// does not pass
	throw new Error("Expect .save() function to throw version mismatch error");
});

it("increments the version number on multiple saves", async () => {
	const ticket = new Ticket({
		title: "concert",
		price: 20,
		userId: "123",
	});

	await ticket.save();
	expect(ticket.version).toEqual(0);

	await ticket.save();
	expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
