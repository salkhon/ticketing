import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
	status = 400;
	// public is a shortcut to create a public property with the same name
	constructor(public errors: ValidationError[]) {
		super("Invalid request parameters");
		// Only because we are extending a built in class
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		return this.errors.map((error) => ({
			message: error.msg,
			field: error.type,
		}));
	}
}
