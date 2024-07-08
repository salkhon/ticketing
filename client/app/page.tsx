import React from "react";
import { getTickets } from "./data/GET";
import Navigation from "./components/Navigation";

export default async function App() {
	const tickets = await getTickets();

	return (
		<>
			<Navigation />
			<h1 className="text-3xl">Tickets</h1>
			<div>
				<table className="table-auto border-collapse w-full mt-4 text-left border">
					<thead>
						<tr>
							<th>Title</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						{tickets.map((ticket) => (
							<tr key={ticket.id}>
								<td>{ticket.title}</td>
								<td>{ticket.price}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
