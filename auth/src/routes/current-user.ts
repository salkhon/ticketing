import express from "express";
import { currentUser } from "@salkhon-ticketing/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
	res.send({ currentUser: req.currentUser ?? null }); // currentUser is optional
});

export { router as currentUserRouter };
