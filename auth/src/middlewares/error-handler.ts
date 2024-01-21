import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	// GOAL: send back consistently structured message back to frontend
	if (err instanceof CustomError) {
		return res.status(err.status).send({ errors: err.serializeErrors() });
	}

	res.status(400).send({
		errors: [{ message: err.message }],
	});
}
