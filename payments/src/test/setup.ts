import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper.ts"); // redirect all imports of the 'nats-wrapper' module to the mock file

let mongo: MongoMemoryServer;

// hook function that runs before all tests
beforeAll(async () => {
	process.env.JWT_KEY = "whatever";

	const mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

// hook function that runs before each test
beforeEach(async () => {
	// reset all mocks (to accurately test the number of times a function was called)
	jest.clearAllMocks();

	// delete all collections
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

// hook function that runs after all tests
afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});

export function generateId() {
	return new mongoose.Types.ObjectId().toHexString();
}

// test utility function to sign up a user and get cookie for supertest (as you would get on the request header)
export function signin(id?: string) {
	// Build a JWT payload. {id, email}
	const payload = {
		id: id ?? generateId(),
		email: "test@test.com",
	};

	// Create the JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build session Object. {jwt: MY_JWT}
	const session = { jwt: token };

	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");

	// return a string thats the cookie with the encoded data
	return `session=${base64}`;
}
