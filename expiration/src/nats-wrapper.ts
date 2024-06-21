import { Subject } from "@salkhon-ticketing/common";
import { NatsConnection, connect } from "nats";

class NATSWrapper {
	private nc?: NatsConnection; // here ? means that it is optional (lazy initialization)

	/**
	 * Connect to the NATS server and create EVENTS stream for ticketing service
	 * @param clusterName - name of the NATS cluster used when starting the NATS server
	 * @param url - URL of the NATS server
	 * @returns void
	 * @throws Error
	 * @async
	 */
	async connect(clusterName: string, url: string) {
		try {
			this.nc = await connect({
				servers: url,
				name: clusterName,
			});
			const jsm = await this.nc.jetstreamManager();
			await jsm.streams.add({ name: "EVENTS", subjects: [Subject.Event] });

			console.log("Connected to NATS");
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Get the NATS connection
	 * @returns NatsConnection
	 * @throws Error
	 */
	get connection() {
		if (!this.nc) {
			throw new Error("NATS connection has not been established before access");
		}

		return this.nc;
	}

	/**
	 * Drain the connection to the NATS server
	 * @returns void
	 * @throws Error
	 * @async
	 */
	async drain() {
		await this.connection.drain();
		console.log("NATS connection drained");
	}
}

export const natsWrapper = new NATSWrapper(); // singleton instance
