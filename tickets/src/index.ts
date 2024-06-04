import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";

/**
 * Setup environment variables, connect to external services and start the app
 * @returns void
 */
async function start() {
	// if secrets are not defined, throw error at the start of the app
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}
	if (!process.env.CLUSTER_NAME) {
		throw new Error("CLUSTER_NAME must be defined");
	}
	if (!process.env.NATS_URL) {
		throw new Error("NATS_URL must be defined");
	}

	try {
		// cluster name and url depends on the nats.yaml file used to setup the NATS depl and service
		await natsWrapper.connect(process.env.CLUSTER_NAME, process.env.NATS_URL);
		// if NATS goes down - the publisher needs to go down as well
		natsWrapper.connection.closed().then(() => {
			console.log("NATS connection dropped - exiting TICKETS service");
			process.exit();
		});
		// graceful NATS drain on service termination
		process.on("SIGINT", () => natsWrapper.drain());
		process.on("SIGTERM", () => natsWrapper.drain());

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
