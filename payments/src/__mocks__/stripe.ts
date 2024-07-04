export const stripe = {
	paymentIntents: {
		create: jest.fn().mockResolvedValue({ id: "mocked_payment_intent_id" }),
		retrieve: jest
			.fn()
			.mockResolvedValue({
				id: "mocked_payment_intent_id",
				client_secret: "mocked_client_secret",
			}),
		cancel: jest.fn().mockResolvedValue({ id: "mocked_payment_intent_id" }),
	},
};
