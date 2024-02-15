import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@salkhon-ticketing/common";

export const app = express();

app.set("trust proxy", true); // trust traffic from ingress-nginx proxy
app.use(json());
app.use(
	cookieSession({
		// disable encryption
		signed: false,
		// only send cookie over HTTPS, cookie will not be sent over HTTP (When not in test environment)
		secure: process.env.NODE_ENV !== "test",
	})
);

// Route handlers

// all other routes for all other methods
app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);
