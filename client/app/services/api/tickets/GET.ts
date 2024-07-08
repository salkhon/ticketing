import { headers } from "next/headers";

export async function getTickets(): Promise<
	{
		id: string;
		title: string;
		price: number;
		userId: string;
		version: number;
	}[]
> {
	const headerList = headers();
	const ticketData = await fetch(
		"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets",
		{
			headers: headerList,
			next: {
				tags: ["tickets"],
			},
		}
	);
	return ticketData.json();
}
