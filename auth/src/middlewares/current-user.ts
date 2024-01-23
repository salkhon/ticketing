import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
	id: string;
	email: string;
}

// augment the existing Request interface (don't have to inherit from it)
declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

export function currentUser(req: Request, res: Response, next: NextFunction) {
	// if the user is not logged in , we just proceed to the next middleware
	if (!req.session?.jwt) {
		return next();
	}

	// get the current user info from the jwt payload
	try {
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;
		req.currentUser = payload;
	} finally {
		next();
	}
}
