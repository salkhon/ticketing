"use client";
import { useFormState } from "react-dom";
import { createOrder } from "../actions";

export default function PurchaseForm({ ticketId }: { ticketId: string }) {
	const [err, formAction] = useFormState(createOrder, "");

	return (
		<div className="mt-4">
			<form action={formAction}>
				<input type="hidden" name="ticketId" value={ticketId} />
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Purchase
				</button>

				{!!err && (
					<div className="border rounded-lg border-red-500 p-3 mt-2">
						<h4 className="text-red-500">Ooops...</h4>
						<ul className="list-disc ml-7 text-red-500">
							{JSON.parse(err).errors.map((err, idx) => (
								<li key={idx}>{err.message}</li>
							))}
						</ul>
					</div>
				)}
			</form>
		</div>
	);
}
