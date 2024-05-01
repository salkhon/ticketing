import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

function start() {
	// if secrets are not defined, throw error at the start of the app
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

	try {
		// cluster name and url depends on the nats.yaml file used to setup the NATS depl and service
		natsWrapper.connect("ticketing", "ticketing-nats-srv:4222");
		// connect to mongodb pod services using service name:port as URL/database
		mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(err);
	}

	// port does not matter because kubernetes governs access to our app
	app.listen(3000, () => {
		console.log("Listening on port 3000");
	});
}

start();
