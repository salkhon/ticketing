import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/req-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

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
	async (req: Request, res: Response) => {
		// validation failure attaches message property to req object
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		// check if user already exists
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new BadRequestError(`Email ${email} already in use`);
		}

		// create new user
		const user = User.build({ email, password });
		await user.save();

		// generate JWT with user id
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			"secret"
		);

		// store JWT on cookie session object
		req.session = {
			...req.session,
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
