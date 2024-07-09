import { getSpecificOrder } from "../../services/api/orders/[id]/GET";
import OrderTimer from "./components/timer";
import Pay from "./components/pay";

export default async function OrderShow({
	params,
}: {
	params: { id: string };
}) {
	const order = await getSpecificOrder(params.id);

	return (
		<div className="m-4">
			<div>
				<h1 className="text-3xl font-bold">Order: {order.ticket.title}</h1>
				<h2 className="text-xl font-bold">${order.ticket.price}</h2>

				<OrderTimer expiresAt={order.expiresAt} />

				<Pay orderId={params.id} />
			</div>
		</div>
	);
}
