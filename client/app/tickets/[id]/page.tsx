import { getSpecificTicket } from "../../services/api/tickets/[id]/GET";
import PurchaseForm from "./components/purchase-form";

export default async function TicketShow({
	params,
}: {
	params: { id: string };
}) {
	const ticketId = params.id;
	const ticket = await getSpecificTicket(ticketId);

	return (
		<div className="m-4">
			<div>
				<h1 className="text-3xl font-bold">{ticket.title}</h1>
				<h4 className="text-xl text-gray-600">Price: {ticket.price}</h4>
			</div>

			{/* client component */}
			<PurchaseForm ticketId={ticketId} />
		</div>
	);
}
