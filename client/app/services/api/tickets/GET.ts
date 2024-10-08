import { cookies } from "next/headers";

export async function getTickets(): Promise<
	{
		id: string;
		title: string;
		price: number;
		userId: string;
		version: number;
	}[]
> {
	const session = cookies().get("session");
	const ticketData = await fetch(
		"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets",
		{
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session?.value};path=/;domain=https://ticketing.dev;secure;httponly`,
			},
			next: {
				tags: ["tickets"],
			},
		}
	);
	return ticketData.json();
}
