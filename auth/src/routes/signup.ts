import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/req-validation-error";
import { DatabaseConnectionError } from "../errors/db-connection-error";

const router = express.Router();

router.post(
	"/api/users/signup",
	// middleware validation
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	(req: Request, res: Response) => {
		const errors = validationResult(req); // validation failure attaches message property to req object
		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;
		// throw new DatabaseConnectionError();
		console.log(
			"Creating a user with email: ",
			email,
			" and password: ",
			password
		);
		res.send({});
	}
);

export { router as signupRouter };
