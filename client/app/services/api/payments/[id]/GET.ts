import { cookies } from "next/headers";

export async function getStripeClientSecret(orderId: string): Promise<string> {
	const session = cookies().get("session");
	const res = await fetch(
		`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/payments/${orderId}`,
		{
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session?.value};path=/;domain=https://ticketing.dev;secure;httponly`,
			},
		}
	);
	return (await res.json()).clientSecret;
}
