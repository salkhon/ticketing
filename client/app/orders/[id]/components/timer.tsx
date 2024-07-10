"use client";
import { useEffect, useState } from "react";

export default function PaymentTimer({
	expiresAt,
	setExpired,
}: {
	expiresAt: string;
	setExpired: (expired: boolean) => void;
}) {
	function calculateTimeLeft() {
		return Math.round(
			(new Date(expiresAt).getTime() - new Date().getTime()) / 1000
		);
	}

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		function findTimeLeft() {
			const secondsLeft = calculateTimeLeft();
			setTimeLeft(secondsLeft);

			if (secondsLeft <= 0) setExpired(true);
		}

		findTimeLeft();
		const timerInterval = setInterval(findTimeLeft, 1000);

		return () => clearInterval(timerInterval); // when component unmounts
	}, [expiresAt]);

	return (
		<div>
			<h4 className="text-xl text-gray-600" suppressHydrationWarning>
				{timeLeft > 0 ? (
					`Time left to purchase: ${timeLeft} seconds`
				) : (
					<span className="text-red-600">Order Expired</span>
				)}
			</h4>
		</div>
	);
}
