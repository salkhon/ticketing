import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

// all other routes for all other methods
app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

function start() {
	try {
		// connect to mongodb pod services using service name:port as URL/database
		mongoose.connect("mongodb://ticketing-auth-mongo-srv:27017/auth");
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
