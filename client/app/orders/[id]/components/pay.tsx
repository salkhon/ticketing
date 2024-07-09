"use client";
import React, { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./checkout-form";

// Make sure to call loadStripe outside of a componentss render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function Pay({ orderId }: { orderId: string }) {
	const [clientSecret, setClientSecret] = useState("");

	useEffect(() => {
		// Create PaymentIntent as soon as the page loads
		fetch(`/api/payments/${orderId}`, {
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
	}, []);

	const appearance = {
		theme: "stripe",
	};
	const options = {
		clientSecret,
		appearance,
	} as StripeElementsOptions;

	return (
		<div className="m-10">
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<StripeCheckoutForm clientSecret={clientSecret} />
				</Elements>
			)}
		</div>
	);
}
