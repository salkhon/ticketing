import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { app } from "../app";

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
