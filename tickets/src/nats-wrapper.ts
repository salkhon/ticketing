import { NatsConnection, connect } from "nats";

class NATSWrapper {
	private _client?: NatsConnection; // here ? means that it is optional (lazy initialization)

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
			this._client = await connect({
				servers: url,
				name: clusterName,
			});
			console.log("Connected to NATS");
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Get the NATS client
	 * @returns NatsConnection
	 * @throws Error
	 */
	get client() {
		if (!this._client) {
			throw new Error("Cannot access NATS client before connecting");
		}

		return this._client;
	}

	/**
	 * Drain the connection to the NATS server
	 * @returns void
	 * @throws Error
	 * @async
	 */
	async drain() {
		await this.client.drain();
		console.log("NATS connection drained");
	}
}

export const natsWrapper = new NATSWrapper(); // singleton instance
