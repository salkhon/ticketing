import React from "react";
import Link from "next/link";
import { getTickets } from "./services/api/tickets/GET";
import { getCurrentUser } from "./services/api/users/currentuser/GET";

export default async function App() {
	const tickets = await getTickets();
	const currentUser = await getCurrentUser();

	return (
		<>
			<div className="flex justify-between items-center">
				<h1 className="text-3xl">Tickets</h1>
			</div>
			<div className="relative overflow-x-auto">
				<table className=" table-auto border-collapse border border-slate-500 w-full mt-4 text-left text-gray-500">
					<thead className="text-gray-700 uppercase bg-gray-5">
						<tr>
							<th scope="col" className="px-6 py-3">
								Title
							</th>
							<th scope="col" className="px-6 py-3">
								Price
							</th>
							<th scope="col" className="px-6 py-3">
								Link
							</th>
						</tr>
					</thead>
					<tbody>
						{tickets.map((ticket) => (
							<tr key={ticket.id} className="bg-white border-b">
								<td
									scope="row"
									className="px-6 py-4 text-gray-900 whitespace-nowrap"
								>
									{ticket.title}
								</td>
								<td
									scope="row"
									className="px-6 py-4 text-gray-900 whitespace-nowrap"
								>
									{ticket.price}
								</td>
								<td
									scope="row"
									className="px-6 py-4 text-gray-900 whitespace-nowrap"
								>
									<Link
										href={`/tickets/${ticket.id}`}
										className="text-blue-600 underline hover:no-underline"
									>
										View
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
