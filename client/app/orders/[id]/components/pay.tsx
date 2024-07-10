"use client";
import React, { useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./checkout-form";
import useRequest from "../../../hooks/use-request";
import PaymentTimer from "./timer";

// Make sure to call loadStripe outside of a componentss render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function Pay({
	orderId,
	expiresAt,
}: {
	orderId: string;
	expiresAt: string;
}) {
	const [clientSecret, setClientSecret] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [expired, setExpired] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/payments/${orderId}`,
		method: "GET",
	});

	async function onClick() {
		setShowModal(!showModal);

		if (!clientSecret) {
			const res = await doRequest();
			setClientSecret(res?.clientSecret);
		}
	}

	const appearance = {
		theme: "stripe",
	};
	const options = {
		clientSecret,
		appearance,
	} as StripeElementsOptions;

	return (
		<>
			<PaymentTimer expiresAt={expiresAt} setExpired={setExpired} />

			<button
				onClick={onClick}
				className="block mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				type="button"
				disabled={expired}
			>
				Pay
			</button>

			{!expired && !!showModal && (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-6 mx-auto max-w-3xl">
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/* Modal header */}
								<div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
									<h3 className="text-xl font-semibold text-gray-900">
										Stripe Payment
									</h3>
									<button
										className="p-1 ml-auto bg-transparent border-0 text-black opacity-20 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
										onClick={onClick}
									>
										x
									</button>
								</div>

								{/* Modal Body */}
								<div className="p-4 md:p-5 space-y-4">
									{!!clientSecret ? (
										<Elements options={options} stripe={stripePromise}>
											<StripeCheckoutForm clientSecret={clientSecret} />
										</Elements>
									) : (
										<div className="mt-4">{errors}</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			)}
		</>
	);
}
