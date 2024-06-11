import express from "express";

const router = express.Router();

router.get("/api/orders", async (req, res) => {
	res.send({ message: "Orders route" });
});

export { router as indexOrderRouter };
