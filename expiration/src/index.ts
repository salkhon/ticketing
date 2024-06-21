import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

/**
 * Setup environment variables, connect to external services.
 * @returns void
 */
async function start() {
	// if secrets are not defined, throw error at the start of the app
	if (!process.env.CLUSTER_NAME) {
		throw new Error("CLUSTER_NAME must be defined");
	}
	if (!process.env.NATS_URL) {
		throw new Error("NATS_URL must be defined");
	}
	if (!process.env.REDIS_HOST) {
		throw new Error("REDIS_HOST must be defined");
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

		new OrderCreatedListener(natsWrapper.connection).listen();
	} catch (err) {
		console.error(err);
		process.exit(); // kube will retry
	}
}

start();
