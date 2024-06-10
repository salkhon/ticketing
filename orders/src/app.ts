import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
	errorHandler,
	NotFoundError,
	currentUser,
} from "@salkhon-ticketing/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
app.use(currentUser); // must be after cookieSession, so that it can check the cookie

// Route handlers
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all("*", async () => {
	throw new NotFoundError();
});

// Error handler
app.use(errorHandler);
