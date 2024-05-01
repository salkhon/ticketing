import { NatsConnection, connect } from "nats";

class NATSWrapper {
	private client?: NatsConnection; // here ? means that it is optional (lazy initialization)

	/**
	 * Connect to the NATS server
	 * @param clusterName - name of the NATS cluster used when starting the NATS server
	 * @param url - URL of the NATS server
	 * @returns void
	 * @throws Error
	 * @async
	 */
	async connect(clusterName: string, url: string) {
		try {
			this.client = await connect({
				servers: url,
				name: clusterName,
			});
			console.log("Connected to NATS");
		} catch (error) {
			console.error(error);
		}
	}

	getClient() {
		if (!this.client) {
			throw new Error("Cannot access NATS client before connecting");
		}

		return this.client;
	}
}

export const natsWrapper = new NATSWrapper(); // singleton instance
