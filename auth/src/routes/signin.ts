import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@salkhon-ticketing/common";
import { User } from "../models/user";
import { BadRequestError } from "@salkhon-ticketing/common";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("You must supply a password"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// check if user exists
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError("Invalid credentials"); // auth errors should be vague to prevent attackers from guessing
		}

		// check if password is correct
		if (!(await Password.compare(existingUser.password, password))) {
			throw new BadRequestError("Invalid credentials");
		}

		// generate JWT with user id
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);

		// store JWT on cookie
		req.session = {
			jwt: userJwt,
		};

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
