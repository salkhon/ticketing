import express from "express";

const router = express.Router();

router.get("/api/orders/:orderId", async (req, res) => {
	res.send({ message: "Show Orders route" });
});

export { router as showOrderRouter };
