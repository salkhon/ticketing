import { cookies, headers } from "next/headers";

export async function getSpecificOrder(id: string): Promise<{
	id: string;
	userId: string;
	status: string;
	expiresAt: string;
	ticket: {
		title: string;
		price: number;
		version: number;
		id: string;
	};
	version: number;
}> {
	const session = cookies().get("session");

	const orderData = await fetch(
		`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders/${id}`,
		{
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session?.value};path=/;domain=https://ticketing.dev;secure;httponly`,
			},
		}
	);
	return orderData.json();
}
