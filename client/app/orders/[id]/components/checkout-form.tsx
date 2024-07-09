"use client";
import React, { useEffect, useState } from "react";
import {
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import useRequest from "../../../hooks/use-request";

const STRIPE_PAYMENT_SUCCESS_EVENT = "payment_intent.succeeded";

export default function StripeCheckoutForm({
	clientSecret,
}: {
	clientSecret: string;
}) {
	const stripe = useStripe();
	const elements = useElements();

	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [paymentIntentId, setPaymentIntentId] = useState("");

	const { doRequest } = useRequest({
		url: "/api/payments/webhook",
		method: "POST",
		onSuccess: () => {
			setMessage("Payment succeeded!");
		},
	});

	useEffect(() => {
		if (!stripe) {
			return;
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			console.log("paymentintent", paymentIntent);
			setPaymentIntentId(paymentIntent.id);
			switch (paymentIntent.status) {
				case "succeeded":
					setMessage("Payment succeeded!");
					break;
				case "processing":
					setMessage("Your payment is processing.");
					break;
				case "requires_payment_method":
					setMessage("Your payment was not successful, please try again.");
					break;
				default:
					setMessage("Something went wrong.");
					break;
			}
		});
	}, [stripe]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements || !paymentIntentId) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);

		// todo: Stripe automatically handles, this is for local testing
		await doRequest({
			type: STRIPE_PAYMENT_SUCCESS_EVENT,
			paymentIntentId: paymentIntentId,
		});

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: "http://ticketing.dev/orders",
			},
		});

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (error.type === "card_error" || error.type === "validation_error") {
			setMessage(error.message);
		} else {
			setMessage("An unexpected error occurred.");
		}

		setIsLoading(false);
	};

	const paymentElementOptions = {
		layout: "tabs",
	} as StripePaymentElementOptions;

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement id="payment-element" options={paymentElementOptions} />
			<button
				disabled={isLoading || !stripe || !elements || !paymentIntentId}
				id="submit"
				className=" mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				<span id="button-text">
					{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
				</span>
			</button>
			{/* Show any error or success messages */}
			{message && <div id="payment-message">{message}</div>}
		</form>
	);
}
