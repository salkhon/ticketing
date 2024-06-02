import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@salkhon-ticketing/common";

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
	validateRequest, // custom middleware to check for validation errors
	async (req: Request, res: Response) => {
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
			process.env.JWT_KEY! // Here ! tells TS that we have already checked for undefined
		);

		// store JWT on cookie session object
		req.session = {
			...req.session,
			jwt: userJwt,
		};

		res.status(201).send(user); // user document is normalized by `toJSON` in the Schema
	}
);

export { router as signupRouter };
