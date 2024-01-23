import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/req-validation-error";

export function validateRequest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// validation failure attaches message property to req object
	const errs = validationResult(req);
	if (!errs.isEmpty()) {
		throw new RequestValidationError(errs.array());
	}

	next(); // if no errors, continue to next middleware
}
