import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import TicketCreatedPublisher from "./events/publishers/ticket-created-publisher";

async function start() {
	// if secrets are not defined, throw error at the start of the app
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

	try {
		// cluster name and url depends on the nats.yaml file used to setup the NATS depl and service
		await natsWrapper.connect("ticketing", "ticketing-nats-srv:4222");
		// if NATS goes down - the publisher needs to go down as well
		natsWrapper.client.closed().then(() => {
			console.log("NATS connection dropped - exiting ticketing service");
			process.exit();
		});
		// graceful NATS drain on service termination
		process.on("SIGINT", () => natsWrapper.drain());
		process.on("SIGTERM", () => natsWrapper.drain());
    // register publisher stream
    new TicketCreatedPublisher(natsWrapper.client).registerStream();

		// connect to mongodb pod services using service name:port as URL/database
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error(err);
		process.exit(); // kube will retry
	}

	// port does not matter because kubernetes governs access to our app
	app.listen(3000, () => {
		console.log("Listening on port 3000");
	});
}

start();
