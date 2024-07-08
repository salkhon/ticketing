"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderShow({ params }: { params: { id: string } }) {
	const expiresAt = useSearchParams().get("expires");
	const [timeLeft, setTimeLeft] = useState(NaN);

	useEffect(() => {
		function findTimeLeft() {
			const msLeft = new Date(expiresAt).getTime() - new Date().getTime();
			setTimeLeft(Math.round(msLeft / 1000));
		}

		findTimeLeft();
		const timerInterval = setInterval(findTimeLeft, 1000);

		return () => clearInterval(timerInterval); // when component unmounts
	}, [params]);

	return (
		<div className="m-4">
			<div>
				<h1 className="text-3xl font-bold">OrderShow</h1>
				<h4 className="text-xl text-gray-600">
					{timeLeft > 0
						? `Time left to purchase: ${timeLeft} seconds`
						: "Order Expired"}
				</h4>
			</div>
		</div>
	);
}
