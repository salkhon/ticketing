export const natsWrapper = {
	// the nc property is private, so no need to mock it because it cannot be used
	// the connect() method is invoked when we are starting up - and we don't want to do that in tests
	// thus we only need the connection - which is the expected output of the natsWrapper
	// the connection is used as an argument to the publisher constructor - which extracts jetstream() from the
	// client and uses it to publish events
	// also by using jest mockimplementation - we can test the call of the publish function as a test for event publishing
	connection: {
		jetstream: jest.fn(() => {
			return {
				publish: async (subject: string, data: string) => {
					return { seq: 0 };
				},
			};
		}),
	},
};
