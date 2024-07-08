import { headers } from "next/headers";

export async function getSpecificTicket(id: string): Promise<{
	id: string;
	title: string;
	price: number;
	userId: string;
	version: number;
}> {
	const headerList = headers();
	const ticketData = await fetch(
		`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets/${id}`,
		{
			headers: headerList,
		}
	);
	return ticketData.json();
}
