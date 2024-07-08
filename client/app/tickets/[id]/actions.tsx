"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// request from nextjs server (server-less?) to indepedent server
//* allows form page to be a server component (does not have to use event handlers)
export async function createOrder(prevState: any, form: FormData) {
	const data = { ticketId: form.get("ticketId") };
	const session = cookies().get("session").value;

	const response = await fetch(
		"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders",
		{
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session}`,
			},
		}
	);

	if (!response.ok) {
		return await response.text();
	} else {
		const order = await response.json();
		redirect(`/orders/${order.id}?expires=${order.expiresAt}`);
	}
}
