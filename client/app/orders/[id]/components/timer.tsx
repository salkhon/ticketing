"use client";
import { useEffect, useState } from "react";

export default function OrderTimer({ expiresAt }: { expiresAt: string }) {
	function calculateTimeLeft() {
		return new Date(expiresAt).getTime() - new Date().getTime();
	}

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		function findTimeLeft() {
			const msLeft = calculateTimeLeft();
			setTimeLeft(Math.round(msLeft / 1000));
		}

		findTimeLeft();
		const timerInterval = setInterval(findTimeLeft, 1000);

		return () => clearInterval(timerInterval); // when component unmounts
	}, [expiresAt]);

	return (
		<div>
			<h4 className="text-xl text-gray-600" suppressHydrationWarning>
				{timeLeft > 0
					? `Time left to purchase: ${timeLeft} seconds`
					: "Order Expired"}
			</h4>
		</div>
	);
}
