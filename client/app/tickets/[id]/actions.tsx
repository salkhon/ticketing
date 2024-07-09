"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// request from nextjs server (server-less?) to indepedent server
//* allows form page to be a server component (does not have to use event handlers)
export async function createOrder(prevState: any, form: FormData) {
	const data = { ticketId: form.get("ticketId") };
	const session = cookies().get("session");

	const response = await fetch(
		"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders",
		{
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session?.value};path=/;domain=https://ticketing.dev;secure;httponly`,
			},
		}
	);

	if (!response.ok) {
		return await response.text();
	}

	const order = await response.json();
	cookies().set("session", session.value, {
		path: "/",
		domain: "https://ticketing.dev",
    secure: true,
    httpOnly: true,
	});
	redirect(`/orders/${order.id}`);
}
